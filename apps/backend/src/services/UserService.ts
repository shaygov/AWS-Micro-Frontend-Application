import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { docClient } from '../context/context'
import { mockUsers } from '../data/mockData'

export class UserService {
  private tableName = process.env.USERS_TABLE || 'users'

  async getAllUsers() {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      })
      
      const response = await docClient.send(command)
      const items = (response.Items || []) as any[]
      const normalized = items.map((item) => ({
        ...item,
        createdAt: item.createdAt ?? new Date().toISOString(),
        updatedAt: item.updatedAt ?? new Date().toISOString(),
        status: item.status ?? 'ACTIVE',
      }))
      return normalized
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('DynamoDB not available, using mock data:', message)
      return mockUsers
    }
  }

  async getUserById(id: string) {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      })
      
      const response = await docClient.send(command)
      const item: any = response.Item
      if (!item) return null
      return {
        ...item,
        createdAt: item.createdAt ?? new Date().toISOString(),
        updatedAt: item.updatedAt ?? new Date().toISOString(),
        status: item.status ?? 'ACTIVE',
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('DynamoDB not available, using mock data:', message)
      return mockUsers.find(user => user.id === id) || null
    }
  }

  async createUser(input: { name: string; email: string }) {
    try {
      const user = {
        id: uuidv4(),
        name: input.name,
        email: input.email,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const command = new PutCommand({
        TableName: this.tableName,
        Item: user,
      })
      
        await docClient.send(command)
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }
  }

  async updateUser(id: string, input: { name?: string; email?: string; status?: string }) {
    try {
      const updateExpression = []
      const expressionAttributeNames: any = {}
      const expressionAttributeValues: any = {}

      if (input.name) {
        updateExpression.push('#name = :name')
        expressionAttributeNames['#name'] = 'name'
        expressionAttributeValues[':name'] = input.name
      }

      if (input.email) {
        updateExpression.push('#email = :email')
        expressionAttributeNames['#email'] = 'email'
        expressionAttributeValues[':email'] = input.email
      }

      if (input.status) {
        updateExpression.push('#status = :status')
        expressionAttributeNames['#status'] = 'status'
        expressionAttributeValues[':status'] = input.status
      }

      updateExpression.push('updatedAt = :updatedAt')
      expressionAttributeValues[':updatedAt'] = new Date().toISOString()

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      
      const response = await docClient.send(command)
      const updated = response.Attributes as any
      return {
        ...updated,
        createdAt: updated?.createdAt ?? new Date().toISOString(),
        updatedAt: updated?.updatedAt ?? new Date().toISOString(),
        status: updated?.status ?? 'ACTIVE',
      }
    } catch (error) {
      console.error('Error updating user:', error)
      throw new Error('Failed to update user')
    }
  }

  async deleteUser(id: string) {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      })
      
      await docClient.send(command)
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Failed to delete user')
    }
  }
}

