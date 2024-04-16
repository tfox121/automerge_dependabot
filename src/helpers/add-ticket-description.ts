import { Issue } from '../types';
import { JIRA_API_URL } from '../config';
import { create_description_item } from './create-description-item';
import cloneDeep from 'lodash.clonedeep';

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

export async function add_ticket_description(
	ticket: Issue,
	description: string,
): Promise<IssueResponse> {
	const new_description_line = create_description_item(description);
	const updated_description = cloneDeep(ticket.fields.description);
	updated_description?.content.push(new_description_line);

	try {
		const response = await fetch(`${JIRA_API_URL}/issue/${ticket.id}?returnIssue=true`, {
			method: 'PUT',
			headers: {
				Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL_ADDRESS}:${JIRA_TOKEN}`).toString('base64')}`,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ fields: { description: updated_description } }),
		});
		const text = await response.text();
		if (!response.ok) throw new Error(text);
		const data = JSON.parse(text) as IssueResponse;
		console.log('Ticket description updated successfully: ', data.self);
		return data;
	} catch (err) {
		console.error('Failed to update ticket: ', ticket.key);
		throw err;
	}
}
