import {spawn} from 'child_process';
import rebaseAndMergeScript from './rebase-and-merge.sh';

export default rebaseAndMerge;

function rebaseAndMerge(context, cb) {
  spawn('/bin/sh', ['-c', getScript(getPRData(context))], {stdio: 'inherit'}).on('exit', exitCode => {
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

function getScript({baseRepo, baseBranch, prRepo, prBranch, dryRun}) {
  const args = [baseRepo, baseBranch, prRepo, prBranch, dryRun];
  return rebaseAndMergeScript.replace(/\$(\d)+?/g, (match, number) => args[number - 1]);
}

