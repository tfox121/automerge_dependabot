import { Build, CodeBuildClient, StartBuildCommand } from '@aws-sdk/client-codebuild';

export async function retry_failed_build(
	client: CodeBuildClient,
	project_name: string,
	failed_build?: Build,
	sha?: string,
) {
	const start_build_command = new StartBuildCommand({
		projectName: project_name,
		sourceTypeOverride: failed_build?.source?.type ?? 'GITHUB',
		sourceLocationOverride:
			failed_build?.source?.location ?? 'https://github.com/compassdigital/cdl.git',
		buildspecOverride: failed_build?.source?.buildspec,
		cacheOverride: failed_build?.cache ?? {
			modes: ['LOCAL_SOURCE_CACHE'],
			type: 'LOCAL',
		},
		gitCloneDepthOverride: failed_build?.source?.gitCloneDepth ?? 1,
		reportBuildStatusOverride: failed_build?.source?.reportBuildStatus ?? true,
		sourceVersion: failed_build?.sourceVersion ?? sha,
	});
	try {
		const start_build_response = await client.send(start_build_command);
		console.log('Build retry started with ID: ', start_build_response.build?.id);
	} catch (err) {
		console.error('Failed to retry build for: ', project_name);
	}
}
