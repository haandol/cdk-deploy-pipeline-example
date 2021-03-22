export namespace App {
  const Namespace = 'CdkDeploymentDemo'

  enum DeployStage {
    DEV = 'Dev',
    PROD = 'Prod',
  }
  const Stage = DeployStage.DEV

  export const Context = {
    ns: Namespace,
    stage: Stage,
  }
}

export namespace Pipeline {
  export const Repository = {
    owner: 'haandol',
    name: 'cdk-deploy-example',
    branch: 'main',
  }

  export const StackNames = [
    `${App.Context.ns}StorageStack`
  ]
}