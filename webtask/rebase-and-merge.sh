#!/bin/bash

set -e # exit if there are any failures

BASE_REPO=$1
BASE_BRANCH=$2

PR_REPO=$3
PR_BRANCH=$4

if [ ! "$TMPDIR" ]; then
  TMPDIR=/tmp
fi

if [[ -z "$BASE_REPO" ]] || [[ -z "$BASE_BRANCH" ]] || [[ -z "$PR_REPO" ]] || [[ -z "$PR_BRANCH" ]]; then
  echo "Must pass BASE_REPO, BASE_BRANCH, PR_REPO, and PR_BRANCH"
  exit 0;
else
  echo "BASE_REPO: ${BASE_REPO}"
  echo "BASE_BRANCH: ${BASE_BRANCH}"
  echo "PR_REPO: ${PR_REPO}"
  echo "PR_BRANCH: ${PR_BRANCH}"
fi

REPO_DIR=$TMPDIR$PR_BRANCH
PR_BRANCH_ALIAS=PR_$PR_BRANCH

echo "R&M: Preparing temp repo dir: ${REPO_DIR}"

rm -rf $REPO_DIR

echo "R&M: cloning repo to temp dir"
git clone $BASE_REPO $REPO_DIR
cd $REPO_DIR

git fetch origin

echo "R&M: checking out $PR_BRANCH_ALIAS $BASE_BRANCH"
git checkout -b $PR_BRANCH_ALIAS $BASE_BRANCH

echo "R&M: pulling pr remote"
git pull $PR_REPO $PR_BRANCH

echo "R&M: rebasing origin/${BASE_BRANCH}"
git rebase origin/$BASE_BRANCH

echo "R&M: checking out ${BASE_BRANCH}"
git checkout $BASE_BRANCH

echo "R&M: merging ${PR_BRANCH_ALIAS}"
git merge --ff-only $PR_BRANCH_ALIAS

echo "R&M: pushing to master"
git push origin master

