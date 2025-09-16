# AWS Micro Frontend Application

A modern, scalable micro-frontend application built with React, GraphQL and Docker. This repo includes a local, fully-containerized stack: frontend shell, backend GraphQL API, DynamoDB Local with persistence, and a DynamoDB Admin UI.

## Architecture

### Frontend (Shell)
- React 18 + TypeScript (Vite)
- Apollo Client for GraphQL
- Styled Components

### Backend
- Apollo Server (Node.js/Express)
- DynamoDB single-table design (via AWS SDK v3)

### DevOps
- Docker Compose (local, multi-container)
- Optional Terraform/Serverless for cloud deploys (not required for local dev)

## Project Structure

```
├── apps/
│   ├── shell/              # React shell (served via Vite preview in container)
│   └── backend/            # GraphQL API
│       └── scripts/        # Utilities (e.g. migrate-to-single-table)
├── apps/dynamo-admin/      # Dockerized DynamoDB Admin UI
├── data/dynamodb/          # Persistent DynamoDB Local data (created at runtime)
├── seeds/                  # Seed JSON files for DynamoDB
├── docker-compose.yml      # Local stack orchestration
└── package.json            # Root scripts
```

## Prerequisites

- Node.js 18+
- Docker Desktop (running)

## Quick Start (Docker, recommended)

```bash
# Build and start the full stack
docker-compose up -d --build

# Or using npm scripts
npm run docker:up
```

Endpoints:
- Frontend (Shell): http://localhost:3000
- GraphQL API: http://localhost:4000/graphql
- DynamoDB Local: http://localhost:8000
- DynamoDB Admin: http://localhost:8001
- Nginx (optional): http://localhost:80

### DynamoDB Persistence
The `dynamodb` service uses a volume: `./data/dynamodb:/home/dynamodblocal/data`. Your tables and items persist across restarts. Avoid `docker-compose down -v` if you want to retain data.

## Switching between Local and AWS

You can switch environments with one command:

```bash
# Local Docker stack (frontend + backend + DynamoDB Local)
npm run switch:local

# AWS (frontend locally, backend on AWS Lambda via API Gateway)
npm run switch:aws
```

What these do:
- `switch:local`: starts Docker services, waits briefly, then seeds DynamoDB Local
- `switch:aws`: deploys Terraform in `infrastructure`, sets frontend `VITE_GRAPHQL_ENDPOINT` to the API Gateway URL, and starts only the shell container

## Seeding Data

With the new single-table, you can either run the migration (recommended) or seed fresh data.

### Option A: Migrate existing local data (old tables → single table)

Run from `apps/backend`:
```bash
npm run migrate:single-table
```
This reads from old tables (`<service>-users-<stage>`, `<service>-dashboard-<stage>`) and writes into the new table `<service>-main-<stage>` using PK/SK and `GSI1`.

### Option B: Seed fresh data (DynamoDB Local)

1) Ensure `dynamodb` and `dynamo-admin` are running:
```bash
docker-compose up -d dynamodb dynamo-admin
```

2) From PowerShell, put initial items directly into the new single table (replace table name if your stage differs):
```powershell
$P = (Get-Location).Path
# Global dashboard stats (PK=DASHBOARD#GLOBAL, SK=STATS)
docker run --rm -v ${P}:/data --network awsapp_app-network `
  -e AWS_ACCESS_KEY_ID=dummy -e AWS_SECRET_ACCESS_KEY=dummy -e AWS_DEFAULT_REGION=us-east-1 `
  amazon/aws-cli dynamodb put-item `
  --table-name aws-micro-frontend-backend-main-local `
  --item '{"PK":{"S":"DASHBOARD#GLOBAL"},"SK":{"S":"STATS"},"totalUsers":{"N":"0"},"activeUsers":{"N":"0"},"totalOrders":{"N":"0"},"revenue":{"N":"0"}}' `
  --endpoint-url http://dynamodb:8000 --region us-east-1

# Example user (PK=USER#<id>, SK=PROFILE, GSI1PK=EMAIL#<email>)
$uid = [guid]::NewGuid().ToString()
docker run --rm --network awsapp_app-network `
  -e AWS_ACCESS_KEY_ID=dummy -e AWS_SECRET_ACCESS_KEY=dummy -e AWS_DEFAULT_REGION=us-east-1 `
  amazon/aws-cli dynamodb put-item `
  --table-name aws-micro-frontend-backend-main-local `
  --item '{"PK":{"S":"USER#'"$uid"'"},"SK":{"S":"PROFILE"},"GSI1PK":{"S":"EMAIL#demo@example.com"},"GSI1SK":{"S":"USER#'"$uid"'"},"userId":{"S":"'"$uid"'"},"name":{"S":"Demo User"},"email":{"S":"demo@example.com"}}' `
  --endpoint-url http://dynamodb:8000 --region us-east-1
```

3) Verify in DynamoDB Admin: http://localhost:8001

## Data Model (Single-table)

- Table: `<service>-main-<stage>` (env: `TABLE_NAME`)
- Primary key: `PK` (partition), `SK` (sort)
- Global Secondary Index: `GSI1` with keys `GSI1PK`, `GSI1SK`

Entities:
- Users: `PK=USER#<userId>`, `SK=PROFILE`, `GSI1PK=EMAIL#<email>`, `GSI1SK=USER#<userId>`
- Global dashboard: `PK=DASHBOARD#GLOBAL`, `SK=STATS`
- Per-user dashboard (optional): `PK=USER#<userId>`, `SK=DASHBOARD#STATS`

Notes:
- Use `Query` on `GSI1` to fetch user by email.
- Use `GetItem` on `PK=USER#<id>, SK=PROFILE` to fetch by id.

## Local Scripts

In the root `package.json`:
- `npm run docker:build` – build containers
- `npm run docker:up` – start all services in detached mode
- `npm run docker:down` – stop all services
- `npm run docker:logs` – follow all logs
- `npm run docker:restart` – restart services

Dev (non-docker) scripts also exist, but Docker is the recommended path for the full local stack.

## Deployment (high level)
- Docker on a server: push images, `docker-compose up -d` on the host
- AWS: use Serverless/Terraform modules in `apps/backend` and `infrastructure` (optional)

## Environment variables

Backend (`apps/backend/serverless.yml`):
- `TABLE_NAME`: name of the single-table (default `${service}-main-${stage}`)
- `STAGE`, `REGION`

Local migration (`apps/backend/scripts/migrate-to-single-table.ts`):
- `SERVICE_NAME`, `STAGE`, `REGION`, `TABLE_NAME`
- `OLD_USERS_TABLE`, `OLD_DASHBOARD_TABLE` (override autodetected names if needed)
- `DDB_ENDPOINT` (defaults to `http://localhost:8000` in dev/local)

## GraphQL Schema (excerpt)
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  status: UserStatus!
  createdAt: String!
  updatedAt: String
}

type DashboardStats {
  totalUsers: Int!
  activeUsers: Int!
  totalOrders: Int!
  revenue: Float!
}

type Query {
  users: [User!]!
  user(id: ID!): User
  dashboardStats: DashboardStats!
}
```

## License
MIT
