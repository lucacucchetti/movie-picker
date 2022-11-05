import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda';
import { IAMAuthorizer } from '../types/authorizer';
import { v4 } from 'uuid';
import { Table } from '@serverless-stack/node/table';

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  const { id } = JSON.parse(event.body!);
  console.log(event);

  const client = new DynamoDBClient({});
  const ddbDocClient = DynamoDBDocument.from(client);

  const movieId = v4();

  try {
    const result = await ddbDocClient.delete({
      TableName: Table.Table.tableName,
      Key: {
        pk: `User#${event.requestContext.authorizer.iam.cognitoIdentity.identityId}`,
        sk: `List#default#Movie#${id}`,
      },
    });

    console.log(result);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ message: 'Success!', id: movieId }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ error: 'Something went wrong while deleting this movie' }),
    };
  }
};
