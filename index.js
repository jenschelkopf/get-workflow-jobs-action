const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const runID = process.env.GITHUB_RUN_ID;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    const token = core.getInput('token');
    const octokit = new github.GitHub(token);

    const response = await octokit.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runID
    });

    const hasFailures = response.data.jobs.findIndex((job) => {
      return job.conclusion == 'failure';
    }) != -1;

    core.setOutput('responses_object', JSON.stringify(response));
    core.setOutput('status', hasFailures ? 'failed' : 'success');

  } catch (error) {
    console.error(error);
    core.setFailed(`The get-workflow-jobs-action action failed with ${error}`);
  }
}

run();
