import { Octokit } from '@octokit/rest';

import { OWNER, REPO } from '../config';
import { PrStatus } from '../types';

export async function list_commit_status(octokit: Octokit, ref: string): Promise<PrStatus[]> {
	try {
		const response = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}/status', {
			owner: OWNER,
			repo: REPO,
			ref,
		});
		return response.data.statuses;
	} catch (err) {
		console.error('Error getting commit statuses:', err);
		return [];
	}
}
