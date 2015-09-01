'use latest';

import spawn from 'spawn-command';

export default rebaseAndMerge;

function rebaseAndMerge(context, cb) {
  const {baseRepo, baseBranch, prRepo, prBranch, dryRun} = getPRData(context);
  spawn(
    `./rebase-and-merge.sh ${baseRepo} ${baseBranch} ${prRepo} ${prBranch} ${dryRun}`,
    {stdio: 'inherit'}
  ).on('exit', exitCode => {
    let error = null;
    let response = 'Success';
    if (exitCode !== 0) {
      error = `Script exited with exit code: ${exitCode}`;
      response = null;
    }
    cb(error, response);
  });
}

function getPRData(context) {
  const addToken = addAuthTokenToRepoUrl.bind(null, context.data.token || context.token);
  return {
    baseRepo: addToken(context.data.baseRepo),
    baseBranch: context.data.baseBranch,
    prRepo: addToken(context.data.prRepo),
    prBranch: context.data.prBranch,
    dryRun: context.data.dryRun || ''
  };
}

function addAuthTokenToRepoUrl(token, url) {
  return url.replace('https://', `https://${token}@`);
}

