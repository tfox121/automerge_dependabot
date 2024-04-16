import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { OWNER, REPO } from '../config';

export async function merge_pull_request(
	octokit: Octokit,
	pr_number: number,
): Promise<RestEndpointMethodTypes['pulls']['merge']['response'] | null> {
	try {
		const merge = await octokit.rest.pulls.merge({
			owner: OWNER,
			repo: REPO,
			pull_number: pr_number,
			merge_method: 'squash', // or 'merge', 'rebase'
			commit_message: '',
		});
		console.log(`Pull request #${pr_number} merged successfully!`);
		return merge;
	} catch (err) {
		console.error(`Failed to merge pull request #${pr_number}:`, err);
		return null;
	}
}
