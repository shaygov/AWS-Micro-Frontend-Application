import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
const isLocal = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local';
const dynamoClient = new DynamoDBClient({
    region: process.env.REGION || 'us-east-1',
    ...(isLocal && {
        endpoint: 'http://dynamodb:8000',
        credentials: {
            accessKeyId: 'dummy',
            secretAccessKey: 'dummy',
        },
    }),
});
export const docClient = DynamoDBDocumentClient.from(dynamoClient);
export const context = async ({ event, context }) => {
    return {
        docClient,
        event,
        context,
    };
};
//# sourceMappingURL=context.js.map