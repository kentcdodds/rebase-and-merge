#!/bin/bash

set -e # exit if there are any failures

rm_echo () {
  echo "> R&M >>" ${@/https:\/\/*@/https:\/\/token-hidden@}
}

BASE_REPO=$1
BASE_BRANCH=$2

PR_REPO=$3
PR_BRANCH=$4
TMP_DIR=$5
DRY_RUN=$6

rm_echo "BASE_REPO: ${BASE_REPO}"
rm_echo "BASE_BRANCH: ${BASE_BRANCH}"
rm_echo "PR_REPO: ${PR_REPO}"
rm_echo "PR_BRANCH: ${PR_BRANCH}"

REPO_DIR=$TMP_DIR/$PR_BRANCH
PR_BRANCH_ALIAS=PR_$PR_BRANCH

run_git () {
  if [ ! "$DRY_RUN" ]; then
    rm_echo "running git $*"
    git "$@"
  else
    rm_echo "DRY_RUN of git $*"
  fi
}

rm -rf "$REPO_DIR"
mkdir "$REPO_DIR"

run_git clone "$BASE_REPO" "$REPO_DIR"
cd "$REPO_DIR"

run_git fetch origin
run_git checkout -b "$PR_BRANCH_ALIAS" "$BASE_BRANCH"
run_git pull "$PR_REPO" "$PR_BRANCH"
run_git rebase origin/"$BASE_BRANCH"
run_git checkout "$BASE_BRANCH"
run_git merge --ff-only "$PR_BRANCH_ALIAS"
run_git push origin "$BASE_BRANCH"

