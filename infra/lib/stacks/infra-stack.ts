import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs'
import { App } from '../interfaces/config'

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here
    new lambdaNodejs.NodejsFunction(this, `MyFunction`, {
      functionName: `${App.Context.ns}MyFunction`,
      entry: path.resolve(__dirname, '..', 'functions', 'my.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(5),
      memorySize: 128,
    })
  }
}
