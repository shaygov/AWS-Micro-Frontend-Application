import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { docClient } from '../context/context'

export class UserService {
  private tableName = process.env.USERS_TABLE || 'users'

  async getAllUsers() {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      })
      
      const response = await docClient.send(command)
      return response.Items || []
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  async getUserById(id: string) {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      })
      
      const response = await docClient.send(command)
      return response.Item || null
    } catch (error) {
      console.error('Error fetching user:', error)
      throw new Error('Failed to fetch user')
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
      return response.Attributes
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

