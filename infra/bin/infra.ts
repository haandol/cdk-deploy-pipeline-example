#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { StorageStack } from '../lib/stacks/storage-stack'
import { PipelineStack } from '../lib/stacks/pipeline-stack'
import { App, Pipeline } from '../lib/interfaces/config'

const app = new cdk.App()

new StorageStack(app, `${App.Context.ns}StorageStack`)

new PipelineStack(app, `${App.Context.ns}PipelineStack`, {
  repo: Pipeline.Repository,
  templateStackNames: Pipeline.StackNames,
})

app.synth()