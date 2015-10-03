#!/bin/bash

set -e # exit if there are any failures

rm_echo () {
  echo "> R&M >>" ${@//https:\/\/*@/https:\/\/token-hidden@}
}

USER_NAME=$1
USER_EMAIL=$2
BASE_REPO=$3
BASE_BRANCH=$4

PR_REPO=$5
PR_BRANCH=$6
DEPTH=$7
TMP_DIR=$8
DRY_RUN=$9

rm_echo "USER_NAME: ${USER_NAME}"
rm_echo "USER_EMAIL: ${USER_EMAIL}"
rm_echo "BASE_REPO: ${BASE_REPO}"
rm_echo "BASE_BRANCH: ${BASE_BRANCH}"
rm_echo "PR_REPO: ${PR_REPO}"
rm_echo "PR_BRANCH: ${PR_BRANCH}"

PR_BRANCH_ALIAS=PR_$PR_BRANCH

run_git () {
  if [ ! "$DRY_RUN" ]; then
    rm_echo "running git $*"
    git "$@"
  else
    rm_echo "DRY_RUN of git $*"
  fi
}

run_git clone --depth=$DEPTH "$BASE_REPO" "$TMP_DIR"
cd "$TMP_DIR"

run_git config user.name "$USER_NAME"
run_git config user.email "$USER_EMAIL"

run_git fetch --depth=$DEPTH origin
run_git checkout "$BASE_BRANCH"
run_git checkout -b "$PR_BRANCH_ALIAS" "$BASE_BRANCH"
run_git pull --depth=$DEPTH "$PR_REPO" "$PR_BRANCH"
run_git rebase origin/"$BASE_BRANCH"
run_git checkout "$BASE_BRANCH"
run_git merge --ff-only "$PR_BRANCH_ALIAS"
run_git push origin "$BASE_BRANCH"

