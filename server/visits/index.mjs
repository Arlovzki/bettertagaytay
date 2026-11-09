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
  transparencyOrigins: (process.env.TRANSPARENCY_ORIGINS ?? '').split(','),
  store: {
    async record(totalId, visitId, expiresAt) {
      try {
        await client.send(
          new TransactWriteItemsCommand({
            TransactItems: [
              {
                Put: {
                  TableName,
                  Item: {
                    id: { S: visitId },
                    expiresAt: { N: String(expiresAt) },
                  },
                  ConditionExpression: 'attribute_not_exists(id)',
                },
              },
              {
                Update: {
                  TableName,
                  Key: { id: { S: totalId } },
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
    async total(totalId) {
      const result = await client.send(
        new GetItemCommand({
          TableName,
          Key: { id: { S: totalId } },
          ConsistentRead: true,
        })
      );
      return Number(result.Item?.visits?.N ?? 0);
    },
  },
});
