# Automerge Depdendabot PRs
This is a tool to manage your assigned Dependabot PRs. With each execution it will take each of your assigned Dependabot PRs and do one of the following:
- Add an "@dependabot rebase" comment if there are merge conflicts.
- Start a new AWS CodeBuild run if the one associated with the PR failed.
- Merge the PR.

Additionally, if you have entered your Jira credentials it will do the following:
- Check to see if an existing maintenance ticket (not released, less than 14 days old) exists for this project (using the project name from CodeBuild).
  - If not it creates a new one with the PR title in the description and assigns it to you.
  - If so it appends the PR title to the description of the existing ticket.

## To run:
Clone a `.env.example` and rename `.env`, replace variables with your GitHub
Username and personal access token (see
[here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)).

If you want to enable Jira ticket creation, input your Jira credentials as well (see [here](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)).

Clone the repo and then `npm i && npm run build`.
Use `npm start` to run.
