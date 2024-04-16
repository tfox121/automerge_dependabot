require('dotenv').config();
import { Octokit } from '@octokit/rest';
import { CodeBuildClient } from '@aws-sdk/client-codebuild';

import {
	find_failed_build,
	get_current_jira_user,
	get_dependabot_pull_requests,
	get_project_name,
	list_check_runs_for_commit,
	list_commit_status,
	merge_pull_request,
	retry_failed_build,
} from './helpers';
import { CheckRuns, PrStatus } from './types';
import { find_ticket } from './helpers/find-ticket';
import { add_ticket_description } from './helpers/add-ticket-description';
import { create_ticket } from './helpers/create-ticket';

const { GITHUB_PERSONAL_ACCESS_TOKEN, JIRA_EMAIL_ADDRESS, JIRA_TOKEN } = process.env;

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

const do_checks_pass = (checks: CheckRuns) =>
	checks.every((check) => check.conclusion === 'success' || check.conclusion === 'skipped');

const do_statuses_pass = (statuses: PrStatus[]) =>
	statuses.every((status) => status.state === 'success');

async function main() {
	const client = new CodeBuildClient({ region: 'us-east-1' });
	const octokit = new Octokit({
		auth: GITHUB_PERSONAL_ACCESS_TOKEN,
		request: {
			fetch,
		},
	});

	const pull_requests = await get_dependabot_pull_requests(octokit);
	if (pull_requests.length > 0) {
		for (const pr of pull_requests) {
			const checks = await list_check_runs_for_commit(octokit, pr.head.sha);
			const statuses = await list_commit_status(octokit, pr.head.sha);
			if (do_checks_pass(checks) && do_statuses_pass(statuses)) {
				console.log('PASSING:', pr.title, 'Merging...');
				const merge = await merge_pull_request(octokit, pr.number);
				// For Jira ticket creation, add your credentials in .env
				if (merge && JIRA_EMAIL_ADDRESS && JIRA_TOKEN) {
					try {
						const project_name = get_project_name(statuses);
						if (!project_name) throw new Error('No valid project name found');
						const existing_ticket = await find_ticket(project_name);
						if (existing_ticket?.[0]) {
							await add_ticket_description(existing_ticket[0], pr.title);
						} else {
							const user = await get_current_jira_user();
							await create_ticket(project_name, user, pr.title);
						}
					} catch (err) {
						console.error('Failed to create/update JIRA ticket for PR:', pr.title);
					}
				}

				sleep(1000);
			} else {
				console.log('\nPENDING:', pr.title, '');
				const failures = statuses.filter(
					(status) => status.state === 'failure' && status.context !== 'Semantic PR',
				);
				if (failures.length) {
					console.log('Retrying:', failures[0]!.target_url);

					const project_name = get_project_name(statuses);
					if (!project_name) {
						console.error(
							`Project name could not be determined from context: ${failures[0]!.context}`,
						);
						return;
					}

					try {
						const failed_build = await find_failed_build(
							client,
							project_name,
							pr.head.sha,
						);
						await retry_failed_build(client, project_name, failed_build);
					} catch (err) {
						console.log('Failed find build for project:', project_name, err);
						console.log('Retrying build with PR SHA only:');
						await retry_failed_build(client, project_name, undefined, pr.head.sha);
					}
				}
				console.log('\n');
			}
		}
		console.log('Merges complete.');
	} else {
		console.log('No pull requests assigned to you or all are already merged.');
	}
}

main();
