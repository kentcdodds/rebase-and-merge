import {exec} from 'child_process';
import rebaseAndMergeScript from './rebase-and-merge.sh';

export default rebaseAndMerge;

function rebaseAndMerge(context, cb) {
  exec(getScript(getPRData(context)), {}, (error, stdout, stderr) => {
    stdout = hideToken(stdout || '');
    stderr = hideToken(stderr || '');
    error = cleanError(error);
    const response = !!error ? null : {type: 'Success', stdout, stderr};
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
  console.log('Calling Script with args: ', hideToken(args.join(' ')));
  return rebaseAndMergeScript.replace(/\$(\d)+?/g, (match, number) => `"${args[number - 1]}"`);
}

function cleanError(error) {
  if (!error) {
    return error;
  }
  if (typeof error === 'string') {
    error = hideToken(error);
  } else {
    ['details', 'message', 'stack'].forEach(item => {
      if (error[item]) {
        error[item] = hideToken(error[item]);
      }
    });
  }
  return error;
}
function hideToken(string) {
  return string.replace(/https\:\/\/.*?@/g, 'https://token-hidden@');
}

