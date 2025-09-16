import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../context/context'
import { mockDashboardStats } from '../data/mockData'

export class DashboardService {
  private tableName = process.env.DASHBOARD_TABLE || 'dashboard'

  async getDashboardStats() {
    try {

      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id: 'stats' },
      });
      
      const response = await docClient.send(command)
      
      if (response.Item) {
        return response.Item
      }

      const defaultStats = {
        id: 'stats',
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0,
        revenue: 0,
        lastUpdated: new Date().toISOString(),
      }

      await this.updateStats(defaultStats)
      return defaultStats
    } catch (error) {
      console.error('DynamoDB not available, using mock data:', error.message)
      return mockDashboardStats
    }
  }

  async updateStats(stats: any) {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
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
