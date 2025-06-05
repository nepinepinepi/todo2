import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT || process.env.AWS_ENDPOINT_URL,
  region: 'us-east-1'
});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = process.env.TABLE_NAME || 'Todos';
const STAGE = process.env.STAGE || 'dev';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const method = event.requestContext.http.method;
  const id = event.pathParameters?.id;

  try {
    if (method === 'GET' && !id) {
      const data = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
      return { statusCode: 200, body: JSON.stringify(data.Items) };
    }
    if (method === 'GET' && id) {
      const data = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
      return { statusCode: 200, body: JSON.stringify(data.Item) };
    }
    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const item = { id: body.id, title: body.title, completed: false, stage: STAGE };
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return { statusCode: 201, body: JSON.stringify(item) };
    }
    if (method === 'PUT' && id) {
      const body = JSON.parse(event.body || '{}');
      await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set title = :t, completed = :c',
        ExpressionAttributeValues: {
          ':t': body.title,
          ':c': body.completed
        }
      }));
      return { statusCode: 204, body: '' };
    }
    if (method === 'DELETE' && id) {
      await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
      return { statusCode: 204, body: '' };
    }
    return { statusCode: 400, body: 'Bad Request' };
  } catch (err) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
