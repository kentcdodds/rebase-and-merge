import {exec} from 'child_process';
import rebaseAndMergeScript from './rebase-and-merge.sh';

export default rebaseAndMerge;

function rebaseAndMerge(context, cb) {
  const data = getPRData(context);
  if (data instanceof Error) {
    return cb(cleanError(data));
  }
  const script = getScript(data);
  if (script instanceof Error) {
    return cb(cleanError(script));
  }
  exec(script, {shell: '/bin/bash'}, (error, stdout = '', stderr = '') => {
    stdout = hideToken(stdout);
    stderr = hideToken(stderr);
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
  const token = context.data.token;
  if (!token) {
    return new Error('Must specify a `token` query param that is your GitHub token with repo access');
  }
  const addToken = addAuthTokenToRepoUrl.bind(null, token);
  return {
    baseRepo: addToken(context.data.baseRepo || ''),
    baseBranch: context.data.baseBranch || '',
    prRepo: addToken(context.data.prRepo || ''),
    prBranch: context.data.prBranch || '',
    dryRun: context.data.dryRun || ''
  };
}

function addAuthTokenToRepoUrl(token, url) {
  return url.replace('https://', `https://${token}@`);
}

function getScript(data) {
  const {baseRepo, baseBranch, prRepo, prBranch, dryRun} = data;
  if (!baseRepo || !baseBranch || !prRepo || !prBranch) {
    return new Error([
      'Missing required query params. Must have `baseRepo`, `baseBranch`, `prRepo`, and `prBranch`',
      'Passed:', 'baseRepo: ' + baseRepo, 'baseBranch: ' + baseBranch, 'prRepo: ' + prRepo, 'prBranch: ' + prBranch
    ].join('\n'));
  }
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

