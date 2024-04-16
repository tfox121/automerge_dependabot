import {
	CodeBuildClient,
	ListBuildsForProjectCommand,
	BatchGetBuildsCommand,
	Build,
} from '@aws-sdk/client-codebuild';

export async function find_failed_build(
	client: CodeBuildClient,
	project_name: string,
	commit_sha: string,
): Promise<Build> {
	// Step 1: List recent builds for the project
	const list_builds_command = new ListBuildsForProjectCommand({
		projectName: project_name,
	});
	const list_builds_response = await client.send(list_builds_command);
	const build_ids = list_builds_response.ids;

	// Step 2: Get build details for the listed builds
	const batch_get_builds_command = new BatchGetBuildsCommand({
		ids: build_ids, // You might limit this to a certain number to optimize
	});
	const builds_response = await client.send(batch_get_builds_command);

	// Step 3: Find the failed build for this commit sha
	const failed_build = builds_response.builds?.find(
		(build) => build.buildStatus === 'FAILED' && build.resolvedSourceVersion === commit_sha,
	);

	if (!failed_build) {
		throw new Error('No failed builds found for project/commit.');
	}

	console.log(`Found a failed build with ID: ${failed_build.id}`);
	return failed_build;
}
