import { Octokit } from '@octokit/rest';
import { OWNER, REPO } from '../config';

export async function trigger_rebase(octokit: Octokit, prNumber: number) {
	console.log('Merge conflict detected, triggering rebase...');
	try {
		await octokit.rest.issues.createComment({
			owner: OWNER,
			repo: REPO,
			issue_number: prNumber,
			body: '@dependabot rebase',
		});
	} catch {
		console.error('Failed to make dependabot rebase comment for PR: ', prNumber);
	}
}
