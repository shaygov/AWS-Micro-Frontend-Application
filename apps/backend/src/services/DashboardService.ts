import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../context/context'
import { mockDashboardStats } from '../data/mockData'

export class DashboardService {
  private tableName = process.env.TABLE_NAME || 'aws-micro-frontend-backend-main-dev'

  async getDashboardStats() {
    try {

      const command = new GetCommand({
        TableName: this.tableName,
        Key: { PK: 'DASHBOARD#GLOBAL', SK: 'STATS' },
      });
      
      const response = await docClient.send(command)
      
      if (response.Item) {
        return response.Item
      }

      const defaultStats = {
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0,
        revenue: 0,
        lastUpdated: new Date().toISOString(),
      }

      await this.updateStats(defaultStats)
      return defaultStats
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('DynamoDB not available, using mock data:', message)
      return mockDashboardStats
    }
  }

  async getDashboardStatsByUser(userId: string) {
    try {
      
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { PK: `USER#${userId}`, SK: 'DASHBOARD#STATS' },
      })

      const response = await docClient.send(command)
      
      if (response.Item) {
        return response.Item
      }

      // Fallback to global stats if per-user not found
      return await this.getDashboardStats()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error('DynamoDB not available, using mock data:', message)
      return mockDashboardStats
    }
  }

  async updateStats(stats: any) {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: 'DASHBOARD#GLOBAL',
          SK: 'STATS',
          ...stats,
          lastUpdated: new Date().toISOString(),
        },
      })
      
      await docClient.send(command)
    } catch (error) {
      console.error('Error updating dashboard stats:', error)
    }
  }

  async incrementUserCount() {
    try {
      const stats = await this.getDashboardStats()
      const updatedStats = {
        ...stats,
        totalUsers: (stats.totalUsers || 0) + 1,
        activeUsers: (stats.activeUsers || 0) + 1,
      }
      await this.updateStats(updatedStats)
    } catch (error) {
      console.error('Error incrementing user count:', error)
    }
  }

  async decrementUserCount() {
    try {
      const stats = await this.getDashboardStats()
      const updatedStats = {
        ...stats,
        totalUsers: Math.max(0, (stats.totalUsers || 0) - 1),
        activeUsers: Math.max(0, (stats.activeUsers || 0) - 1),
      }
      await this.updateStats(updatedStats)
    } catch (error) {
      console.error('Error decrementing user count:', error)
    }
  }
}
