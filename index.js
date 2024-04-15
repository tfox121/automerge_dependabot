/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
require('dotenv').config();
const fetch = (...args) =>
  import('node-fetch').then(({ default: _fetch }) => _fetch(...args));
const { Octokit } = require('@octokit/rest');

const { GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_USERNAME } = process.env;

const octokit = new Octokit({
  auth: GITHUB_PERSONAL_ACCESS_TOKEN,
  request: {
    fetch,
  },
});
const owner = 'compassdigital';
const repo = 'cdl';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getDependabotPullRequests() {
  try {
    const response = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'open',
      per_page: 100,
    });

    return response.data.filter(
      (pr) =>
        pr.assignee?.login === GITHUB_USERNAME &&
        pr.user.type === 'Bot' &&
        pr.user.login.includes('dependabot'),
    );
  } catch (error) {
    console.error('Failed to retrieve pull requests:', error);
    return [];
  }
}

async function listCheckRunsForCommit(ref) {
  try {
    const response = await octokit.rest.checks.listForRef({
      owner,
      repo,
      ref,
    });

    return response.data.check_runs;
  } catch (err) {
    console.error('Error listing check runs:', err.message);
    return null;
  }
}

async function listCommitStatus(ref) {
  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/commits/{ref}/status',
      {
        owner,
        repo,
        ref,
      },
    );
    return response.data.statuses;
  } catch (err) {
    console.error('Error listing check runs:', err.message);
    return null;
  }
}

async function mergePullRequest(prNumber) {
  try {
    await octokit.rest.pulls.merge({
      owner,
      repo,
      pull_number: prNumber,
      merge_method: 'squash', // or 'merge', 'rebase'
      commit_message: '',
    });
    console.log(`Pull request #${prNumber} merged successfully!`);
  } catch (err) {
    console.error(`Failed to merge pull request #${prNumber}:`, err);
  }
}

const doChecksPass = (checks) =>
  checks.every(
    (check) => check.conclusion === 'success' || check.conclusion === 'skipped',
  );

const doStatusesPass = (statuses) =>
  statuses.every((status) => status.state === 'success');

async function main() {
  const pullRequests = await getDependabotPullRequests();
  if (pullRequests.length > 0) {
    for (const pr of pullRequests) {
      const checks = await listCheckRunsForCommit(pr.head.sha);
      const statuses = await listCommitStatus(pr.head.sha);
      if (doChecksPass(checks) && doStatusesPass(statuses)) {
        console.log('PASS:', pr.title);
        await mergePullRequest(pr.number);
        sleep(1000);
      } else {
        console.log('\nFAIL:', pr.title);
        console.log(
          'Retry:',
          statuses.filter((status) => status.state === 'failure')[0].target_url,
          '\n',
        );
      }
    }
    console.log('Merges complete.');
  } else {
    console.log('No pull requests assigned to you or all are already merged.');
  }
}

main();
