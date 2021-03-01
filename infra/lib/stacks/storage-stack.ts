import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import { App } from '../interfaces/config'

export class StorageStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const table = new dynamodb.Table(this, `MyTable`, {
      tableName: `${App.Context.ns}MyTable`,
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })
    table.addGlobalSecondaryIndex({
      indexName: 'GS1',
      partitionKey: {
        name: 'GS1PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GS1SK',
        type: dynamodb.AttributeType.STRING,
      },
    })
  }
}
