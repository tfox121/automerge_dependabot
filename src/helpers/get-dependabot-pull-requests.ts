import { Octokit } from '@octokit/rest';
import { OWNER, REPO } from '../config';

const { GITHUB_USERNAME } = process.env;

export async function get_dependabot_pull_requests(octokit: Octokit) {
	try {
		const response = await octokit.rest.pulls.list({
			owner: OWNER,
			repo: REPO,
			state: 'open',
			per_page: 100,
		});

		return Promise.all(
			response.data
				.filter(
					(pr) =>
						pr.assignee?.login === GITHUB_USERNAME &&
						pr.user?.type === 'Bot' &&
						pr.user.login.includes('dependabot'),
				)
				.map(async (pr) =>
					octokit.rest.pulls
						.get({
							owner: OWNER,
							repo: REPO,
							pull_number: pr.number,
						})
						.then((res) => res.data),
				),
		);
	} catch (err) {
		console.error('Failed to retrieve pull requests:', err);
		return [];
	}
}
