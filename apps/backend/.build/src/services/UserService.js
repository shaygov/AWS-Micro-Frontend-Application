import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient } from '../context/context';
import { mockUsers } from '../data/mockData';
export class UserService {
    constructor() {
        this.tableName = process.env.TABLE_NAME || 'aws-micro-frontend-backend-main-dev';
    }
    async getAllUsers() {
        try {
            // In single-table design, list all users by scanning for SK = 'PROFILE'.
            // For production, consider maintaining an indexable marker to allow Query.
            const command = new ScanCommand({
                TableName: this.tableName,
                FilterExpression: '#sk = :sk',
                ExpressionAttributeNames: { '#sk': 'SK' },
                ExpressionAttributeValues: { ':sk': 'PROFILE' },
            });
            const response = await docClient.send(command);
            const items = (response.Items || []);
            const normalized = items.map((item) => ({
                id: item.userId || item.id?.replace('USER#', ''),
                name: item.name,
                email: item.email,
                status: item.status ?? 'ACTIVE',
                createdAt: item.createdAt ?? new Date().toISOString(),
                updatedAt: item.updatedAt ?? new Date().toISOString(),
            }));
            return normalized;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('DynamoDB not available, using mock data:', message);
            return mockUsers;
        }
    }
    async getUserById(id) {
        try {
            const command = new GetCommand({
                TableName: this.tableName,
                Key: { PK: `USER#${id}`, SK: 'PROFILE' },
            });
            const response = await docClient.send(command);
            const item = response.Item;
            if (!item)
                return null;
            return {
                id,
                name: item.name,
                email: item.email,
                createdAt: item.createdAt ?? new Date().toISOString(),
                updatedAt: item.updatedAt ?? new Date().toISOString(),
                status: item.status ?? 'ACTIVE',
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('DynamoDB not available, using mock data:', message);
            return mockUsers.find(user => user.id === id) || null;
        }
    }
    async createUser(input) {
        try {
            const user = {
                id: uuidv4(),
                name: input.name,
                email: input.email,
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const command = new PutCommand({
                TableName: this.tableName,
                Item: {
                    PK: `USER#${user.id}`,
                    SK: 'PROFILE',
                    GSI1PK: `EMAIL#${user.email}`,
                    GSI1SK: `USER#${user.id}`,
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(GSI1PK)'
            });
            await docClient.send(command);
            return user;
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }
    async updateUser(id, input) {
        try {
            const updateExpression = [];
            const expressionAttributeNames = {};
            const expressionAttributeValues = {};
            if (input.name) {
                updateExpression.push('#name = :name');
                expressionAttributeNames['#name'] = 'name';
                expressionAttributeValues[':name'] = input.name;
            }
            if (input.email) {
                updateExpression.push('#email = :email');
                expressionAttributeNames['#email'] = 'email';
                expressionAttributeValues[':email'] = input.email;
            }
            if (input.status) {
                updateExpression.push('#status = :status');
                expressionAttributeNames['#status'] = 'status';
                expressionAttributeValues[':status'] = input.status;
            }
            updateExpression.push('updatedAt = :updatedAt');
            expressionAttributeValues[':updatedAt'] = new Date().toISOString();
            const command = new UpdateCommand({
                TableName: this.tableName,
                Key: { PK: `USER#${id}`, SK: 'PROFILE' },
                UpdateExpression: `SET ${updateExpression.join(', ')}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: 'ALL_NEW',
            });
            const response = await docClient.send(command);
            const updated = response.Attributes;
            return {
                id,
                name: updated?.name,
                email: updated?.email,
                createdAt: updated?.createdAt ?? new Date().toISOString(),
                updatedAt: updated?.updatedAt ?? new Date().toISOString(),
                status: updated?.status ?? 'ACTIVE',
            };
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }
    async deleteUser(id) {
        try {
            const command = new DeleteCommand({
                TableName: this.tableName,
                Key: { PK: `USER#${id}`, SK: 'PROFILE' },
            });
            await docClient.send(command);
            return true;
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }
    async getUserByEmail(email) {
        try {
            const command = new QueryCommand({
                TableName: this.tableName,
                IndexName: 'GSI1',
                KeyConditionExpression: 'GSI1PK = :g1pk',
                ExpressionAttributeValues: { ':g1pk': `EMAIL#${email}` },
                Limit: 1,
            });
            const response = await docClient.send(command);
            const item = response.Items?.[0];
            if (!item)
                return null;
            return {
                id: item.userId,
                name: item.name,
                email: item.email,
                status: item.status ?? 'ACTIVE',
                createdAt: item.createdAt ?? new Date().toISOString(),
                updatedAt: item.updatedAt ?? new Date().toISOString(),
            };
        }
        catch (error) {
            console.error('Error getting user by email:', error);
            return null;
        }
    }
}
//# sourceMappingURL=UserService.js.map