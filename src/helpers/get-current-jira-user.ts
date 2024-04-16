import { JIRA_API_URL } from '../config';
import { User } from '../types';

const { JIRA_EMAIL_ADDRESS, JIRA_TOKEN } = process.env;

export async function get_current_jira_user(): Promise<User> {
	try {
		const response = await fetch(`${JIRA_API_URL}/myself`, {
			method: 'GET',
			headers: {
				Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL_ADDRESS}:${JIRA_TOKEN}`).toString(
					'base64',
				)}`,
				Accept: 'application/json',
			},
		});
		const text = await response.text();
		if (!response.ok) throw new Error(text);
		const data = JSON.parse(text) as User;
		return data;
	} catch (err) {
		console.error('Failed to get current user', err);
		throw err;
	}
}
