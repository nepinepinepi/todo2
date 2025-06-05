const { handler } = require('../todos');

const mockSend = jest.fn();
jest.mock('@aws-sdk/lib-dynamodb', () => {
  const original = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...original,
    DynamoDBDocumentClient: { from: () => ({ send: mockSend }) }
  };
});

beforeEach(() => {
  mockSend.mockReset();
});

test('returns 400 for unsupported method', async () => {
  const res = await handler({ requestContext: { http: { method: 'PATCH' } } });
  expect(res.statusCode).toBe(400);
});
