import { Octokit } from '@octokit/rest';

const { GITHUB_USERNAME } = process.env;
const owner = 'compassdigital';
const repo = 'cdl';

export async function get_dependabot_pull_requests(octokit: Octokit) {
	try {
		const response = await octokit.rest.pulls.list({
			owner,
			repo,
			state: 'open',
			per_page: 100,
		});

		return response.data.filter(
			(pr) =>
				// pr.assignee?.login === GITHUB_USERNAME &&
				pr.user?.type === 'Bot' && pr.user.login.includes('dependabot'),
		);
	} catch (err) {
		console.error('Failed to retrieve pull requests:', err);
		return [];
	}
}
