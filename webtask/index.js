import {exec} from 'child_process';
import rebaseAndMergeScript from './rebase-and-merge.sh';

export default rebaseAndMerge;

function rebaseAndMerge(context, cb) {
  const command = exec(getScript(getPRData(context)), {}, (error, stdout, stderr) => {
    const response = !!error ? null : 'Success';
    if (stderr) {
      console.error('stderr:', stderr);
    }
    if (stdout) {
      console.log('stdout:', stdout);
    }
    cb(error, response);
  });
}

function getPRData(context) {
  const addToken = addAuthTokenToRepoUrl.bind(null, context.data.token || context.token);
  return {
    baseRepo: addToken(context.data.baseRepo || ''),
    baseBranch: context.data.baseBranch,
    prRepo: addToken(context.data.prRepo || ''),
    prBranch: context.data.prBranch,
    dryRun: context.data.dryRun || ''
  };
}

function addAuthTokenToRepoUrl(token, url) {
  return url.replace('https://', `https://${token}@`);
}

function getScript({baseRepo, baseBranch, prRepo, prBranch, dryRun}) {
  const args = [baseRepo, baseBranch, prRepo, prBranch, dryRun];
  console.log('Calling Script with args: ', args.join(' ').replace(/https\:\/\/.*?@/g, 'https://token-hidden@'));
  return rebaseAndMergeScript.replace(/\$(\d)+?/g, (match, number) => args[number - 1]);
}

