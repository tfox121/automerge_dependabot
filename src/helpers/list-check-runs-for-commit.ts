import { Octokit } from '@octokit/rest';

import { OWNER, REPO } from '../config';
import { CheckRuns } from '../types';

export async function list_check_runs_for_commit(
	octokit: Octokit,
	ref: string,
): Promise<CheckRuns> {
	try {
		const response = await octokit.rest.checks.listForRef({
			owner: OWNER,
			repo: REPO,
			ref,
		});

		return response.data.check_runs;
	} catch (err) {
		console.error('Error getting commit checks:', err);
		return [];
	}
}
