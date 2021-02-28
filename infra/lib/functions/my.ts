import * as awsLambda from 'aws-lambda'

export async function handler(event: awsLambda.APIGatewayProxyEventV2, context: any): Promise<awsLambda.APIGatewayProxyResultV2> {
  return {
    statusCode: 200,
    body: 'This is my Function V1',
  }
}