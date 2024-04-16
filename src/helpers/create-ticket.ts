import { JIRA_API_URL } from '../config';
import { User, Issue } from '../types';
import { create_description_item } from './create-description-item';

const { JIRA_EMAIL_ADDRESS, JIRA_TOKEN } = process.env;

interface IssueResponse {
	id: string;
	key: string;
	self: string;
	transition: {
		status: number;
		errorCollection: {
			errorMessages: string[];
			errors: Record<string, string>; // A mapping of error keys to their messages
		};
	};
}

export async function create_ticket(
	project: string,
	user: User,
	description: string,
): Promise<IssueResponse> {
	try {
		const issue_data: Issue = {
			fields: {
				summary: `Maintenance: release ${project}`,
				description: {
					content: [create_description_item(description)],
					type: 'doc',
					version: 1,
				},
				reporter: {
					id: user.accountId,
				},
				assignee: {
					id: user.accountId,
				},
				project: {
					key: 'CDL',
				},
				issuetype: {
					name: 'Task',
				},
			},
		};

		const response = await fetch(`${JIRA_API_URL}/issue`, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL_ADDRESS}:${JIRA_TOKEN}`).toString('base64')}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(issue_data),
		});
		const text = await response.text();
		if (!response.ok) throw new Error(text);
		const data = JSON.parse(text) as IssueResponse;
		console.log('New ticket created successfully for project: ', project, data.key);
		return data;
	} catch (err) {
		console.error('Failed to create ticket for project: ', err, project);
		throw err;
	}
}
