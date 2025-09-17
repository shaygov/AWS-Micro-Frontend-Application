import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export declare const docClient: DynamoDBDocumentClient;
export interface Context {
    docClient: DynamoDBDocumentClient;
    event: any;
    context: any;
}
export declare const context: ({ event, context }: {
    event: any;
    context: any;
}) => Promise<Context>;
//# sourceMappingURL=context.d.ts.map