import { Api, Cognito, ReactStaticSite, StackContext, Table } from '@serverless-stack/resources';

export function MyStack({ stack, app }: StackContext) {
  const auth = new Cognito(stack, 'Auth', {
    login: ['email', 'phone'],
  });

  // Standard DynamoDB single table
  const table = new Table(stack, 'Table', {
    fields: {
      pk: 'string',
      sk: 'string',
    },
    primaryIndex: { partitionKey: 'pk', sortKey: 'sk' },
  });

  // Create an HTTP API
  const api = new Api(stack, 'Api', {
    // Secure it with IAM Auth
    defaults: {
      authorizer: 'iam',
      function: { bind: [table] },
    },
    routes: {
      'GET /list': 'functions/list.handler',
      'POST /movie': 'functions/create-movie.handler',
      'DELETE /movie': 'functions/delete-movie.handler',
    },
  });

  // Allow authenticated users to invoke the API
  auth.attachPermissionsForAuthUsers(stack, [api]);

  // Deploy our React app
  const site = new ReactStaticSite(stack, 'ReactSite', {
    path: 'frontend',
    // Pass in our environment variables
    environment: {
      REACT_APP_API_URL: api.url,
      REACT_APP_REGION: app.region,
      REACT_APP_USER_POOL_ID: auth.userPoolId,
      REACT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId!,
      REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    },
    customDomain:
      app.stage === 'prod'
        ? {
            domainName: 'cucchetti.link',
            domainAlias: 'www.cucchetti.link',
          }
        : undefined,
  });

  // Show the endpoint in the output
  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url,
    ApiEndpoint: api.url,
  });
}
