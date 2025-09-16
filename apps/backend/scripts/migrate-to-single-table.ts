import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, ResourceInUseException } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

// Config
const SERVICE = process.env.SERVICE_NAME || 'aws-micro-frontend-backend'
const STAGE = process.env.STAGE || process.env.NODE_ENV || 'dev'
const REGION = process.env.REGION || 'us-east-1'
const TABLE_NAME = process.env.TABLE_NAME || `${SERVICE}-main-${STAGE}`

// Old tables (fallback to previous naming convention)
const OLD_USERS_TABLE = process.env.OLD_USERS_TABLE || `${SERVICE}-users-${STAGE}`
const OLD_DASHBOARD_TABLE = process.env.OLD_DASHBOARD_TABLE || `${SERVICE}-dashboard-${STAGE}`

// Local endpoint override (host: http://localhost:8000 for host machine)
const DDB_ENDPOINT = process.env.DDB_ENDPOINT || (['development', 'local', 'dev'].includes(String(process.env.NODE_ENV)) ? 'http://localhost:8000' : undefined)

function createClients() {
  const dynamoClient = new DynamoDBClient({
    region: REGION,
    ...(DDB_ENDPOINT
      ? {
          endpoint: DDB_ENDPOINT,
          credentials: { accessKeyId: 'dummy', secretAccessKey: 'dummy' },
        }
      : {}),
  })
  return { ddb: dynamoClient, doc: DynamoDBDocumentClient.from(dynamoClient) }
}

const { ddb, doc } = createClients()

async function ensureMainTable() {
  try {
    await ddb.send(new DescribeTableCommand({ TableName: TABLE_NAME }))
    console.log(`Table exists: ${TABLE_NAME}`)
    return
  } catch (e: any) {
    console.log(`Table not found, creating: ${TABLE_NAME}`)
  }
  try {
    await ddb.send(
      new CreateTableCommand({
        TableName: TABLE_NAME,
        AttributeDefinitions: [
          { AttributeName: 'PK', AttributeType: 'S' },
          { AttributeName: 'SK', AttributeType: 'S' },
          { AttributeName: 'GSI1PK', AttributeType: 'S' },
          { AttributeName: 'GSI1SK', AttributeType: 'S' },
        ],
        KeySchema: [
          { AttributeName: 'PK', KeyType: 'HASH' },
          { AttributeName: 'SK', KeyType: 'RANGE' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'GSI1',
            KeySchema: [
              { AttributeName: 'GSI1PK', KeyType: 'HASH' },
              { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
          },
        ],
        BillingMode: 'PAY_PER_REQUEST',
      })
    )
    console.log('CreateTable issued. Waiting 2s for local DynamoDB...')
    await new Promise((r) => setTimeout(r, 2000))
  } catch (err: any) {
    if (!(err instanceof ResourceInUseException)) {
      throw err
    }
  }
}

async function migrateUsers() {
  console.log(`Scanning old users from ${OLD_USERS_TABLE} ...`)
  let lastKey: any = undefined
  let migrated = 0
  do {
    const res = await doc.send(
      new ScanCommand({ TableName: OLD_USERS_TABLE, ExclusiveStartKey: lastKey })
    )
    for (const item of res.Items || []) {
      const id = item.id
      const name = item.name
      const email = item.email
      const status = item.status ?? 'ACTIVE'
      const createdAt = item.createdAt ?? new Date().toISOString()
      const updatedAt = item.updatedAt ?? new Date().toISOString()

      await doc.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `USER#${id}`,
            SK: 'PROFILE',
            GSI1PK: `EMAIL#${email}`,
            GSI1SK: `USER#${id}`,
            userId: id,
            name,
            email,
            status,
            createdAt,
            updatedAt,
          },
        })
      )
      migrated += 1
    }
    lastKey = res.LastEvaluatedKey
    console.log(`Users migrated so far: ${migrated}`)
  } while (lastKey)
  console.log(`Users migration done. Total: ${migrated}`)
}

async function migrateDashboard() {
  console.log(`Migrating dashboard from ${OLD_DASHBOARD_TABLE} ...`)
  // Global stats with id = 'stats'
  const statsRes = await doc.send(
    new GetCommand({ TableName: OLD_DASHBOARD_TABLE, Key: { id: 'stats' } })
  )
  const stats = statsRes.Item || {
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    revenue: 0,
    lastUpdated: new Date().toISOString(),
  }
  await doc.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: 'DASHBOARD#GLOBAL',
        SK: 'STATS',
        totalUsers: stats.totalUsers || 0,
        activeUsers: stats.activeUsers || 0,
        totalOrders: stats.totalOrders || 0,
        revenue: stats.revenue || 0,
        lastUpdated: new Date().toISOString(),
      },
    })
  )
  console.log('Global dashboard stats migrated.')

  // If the old table also contained per-user stats (id == userId), copy them
  let lastKey: any = undefined
  let copied = 0
  do {
    const res = await doc.send(
      new ScanCommand({ TableName: OLD_DASHBOARD_TABLE, ExclusiveStartKey: lastKey })
    )
    for (const item of res.Items || []) {
      if (item.id === 'stats') continue
      const userId = item.id
      await doc.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            PK: `USER#${userId}`,
            SK: 'DASHBOARD#STATS',
            totalUsers: item.totalUsers ?? 0,
            activeUsers: item.activeUsers ?? 0,
            totalOrders: item.totalOrders ?? 0,
            revenue: item.revenue ?? 0,
            lastUpdated: new Date().toISOString(),
          },
        })
      )
      copied += 1
    }
    lastKey = res.LastEvaluatedKey
  } while (lastKey)
  console.log(`Per-user dashboard stats copied: ${copied}`)
}

async function main() {
  console.log('Starting migration to single-table design...')
  console.log({ TABLE_NAME, OLD_USERS_TABLE, OLD_DASHBOARD_TABLE, REGION, DDB_ENDPOINT })
  await ensureMainTable()
  await migrateUsers()
  await migrateDashboard()
  console.log('Migration completed.')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})


