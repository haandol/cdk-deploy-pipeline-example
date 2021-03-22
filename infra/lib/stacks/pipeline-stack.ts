import * as cdk from '@aws-cdk/core'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions'

export interface PipelineStackProps extends cdk.StackProps {
  repo: {
    name: string
    owner: string
    branch: string
  }
  templateStackNames: string[]
}

export class PipelineStack extends cdk.Stack {
  constructor(app: cdk.App, id: string, props: PipelineStackProps) {
    super(app, id, props)

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline')

    const sourceOutput = new codepipeline.Artifact();
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: 'GithubSource',
          oauthToken: cdk.SecretValue.secretsManager('github-token'),
          owner: props.repo.owner,
          repo: props.repo.name,
          branch: props.repo.branch,
          output: sourceOutput,
        }),
      ],
    })

    const cdkBuildProject = new codebuild.PipelineProject(this, 'CdkBuildProject', {
      buildSpec: this.createBuildSpec(props),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
    });
    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'CdkBuild',
          project: cdkBuildProject,
          input: sourceOutput,
          outputs: [cdkBuildOutput],
        }),
      ],
    })

    pipeline.addStage({
      stageName: 'Deploy',
      actions: props.templateStackNames.map((stackName) => {
        return new codepipeline_actions.CloudFormationCreateUpdateStackAction({
          actionName: `CfnDeploy-${stackName}`,
          templatePath: cdkBuildOutput.atPath(`${stackName}.template.json`),
          stackName,
          adminPermissions: true,
        })
      })
    });
  }

  private createBuildSpec(props: PipelineStackProps) {
    return codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          commands: [
            'cd infra',
            'npm i -g typescript npm',
            'npm i',
            'ls -al',
          ]
        },
        build: {
          commands: [
            'npm run build',
            'npm run cdk synth -- -o dist'
          ],
        },
      },
      artifacts: {
        'base-directory': 'infra/dist',
        files: props.templateStackNames.map((stackName) => {
          return `${stackName}.template.json`
        }),
      },
    })
  }

}