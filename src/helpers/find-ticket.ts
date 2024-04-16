import { JIRA_API_URL } from '../config';
import { Issue } from '../types';

const { JIRA_EMAIL_ADDRESS, JIRA_TOKEN } = process.env;

interface FindIssueResponse {
	expand: string;
	issues: Issue[];
	maxResults: number;
	startAt: number;
	total: number;
	warningMessages: string[];
}

export async function find_ticket(project: string): Promise<Issue[]> {
	const jql = encodeURIComponent(
		`summary ~ "${project}" AND summary ~ "Maintenance" AND status != "Released" AND created >= -14d ORDER BY created DESC`,
	);

	const response = await fetch(`${JIRA_API_URL}/search?jql=${jql}&maxResults=1`, {
		method: 'GET',
		headers: {
			Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL_ADDRESS}:${JIRA_TOKEN}`).toString('base64')}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	const text = await response.text();
	if (!response.ok) throw new Error(text);
	const data = JSON.parse(text) as FindIssueResponse;

	return data.issues;
}
