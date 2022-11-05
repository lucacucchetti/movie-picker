import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEventV2WithRequestContext } from 'aws-lambda';
import { IAMAuthorizer } from '../types/authorizer';
import { Table } from '@serverless-stack/node/table';

interface DynamoDBMovieItem {
  pk: string;
  sk: string;
  title: string;
}

interface MovieItem {
  id: string;
  title: string;
}

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<IAMAuthorizer>) => {
  console.log(event);

  const client = new DynamoDBClient({});
  const ddbDocClient = DynamoDBDocument.from(client);

  try {
    const result = await ddbDocClient.query({
      TableName: Table.Table.tableName,
      KeyConditions: {
        pk: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [`User#${event.requestContext.authorizer.iam.cognitoIdentity.identityId}`],
        },
        sk: { ComparisonOperator: 'BEGINS_WITH', AttributeValueList: ['List#default#Movie#'] },
      },
    });

    console.log(result.Items);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({
        message: 'Success!',
        items: convertItemsToApiFormat(result.Items as DynamoDBMovieItem[]),
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ error: 'Something went wrong while saving this movie' }),
    };
  }
};

function convertItemsToApiFormat(dynamoDbItems: DynamoDBMovieItem[]): MovieItem[] {
  return dynamoDbItems.map((dynamoDbItem) => toApiFormatMovie(dynamoDbItem));
}

function toApiFormatMovie(dynamoDbMovieItem: DynamoDBMovieItem): MovieItem {
  return { id: dynamoDbMovieItem.sk.replaceAll('List#default#Movie#', ''), title: dynamoDbMovieItem.title };
}
