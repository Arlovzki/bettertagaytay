import {
  DynamoDBClient,
  GetItemCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { createHandler } from './handler.mjs';

const client = new DynamoDBClient({});
const TableName = process.env.TABLE_NAME;

export const handler = createHandler({
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? '').split(','),
  store: {
    async record(sessionId, expiresAt) {
      try {
        await client.send(
          new TransactWriteItemsCommand({
            TransactItems: [
              {
                Put: {
                  TableName,
                  Item: {
                    id: { S: `visit#${sessionId}` },
                    expiresAt: { N: String(expiresAt) },
                  },
                  ConditionExpression: 'attribute_not_exists(id)',
                },
              },
              {
                Update: {
                  TableName,
                  Key: { id: { S: 'total' } },
                  UpdateExpression: 'ADD visits :one',
                  ExpressionAttributeValues: { ':one': { N: '1' } },
                },
              },
            ],
          })
        );
      } catch (error) {
        // Only the conditional failure means this visit was already counted.
        if (
          error.name === 'TransactionCanceledException' &&
          error.CancellationReasons?.[0]?.Code === 'ConditionalCheckFailed' &&
          error.CancellationReasons?.[1]?.Code === 'None'
        )
          return;
        throw error;
      }
    },
    async total() {
      const result = await client.send(
        new GetItemCommand({
          TableName,
          Key: { id: { S: 'total' } },
          ConsistentRead: true,
        })
      );
      return Number(result.Item?.visits?.N ?? 0);
    },
  },
});
