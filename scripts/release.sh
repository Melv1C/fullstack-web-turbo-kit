#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
. "$SCRIPT_DIR/sh/logging.sh"

echo "release: starting process"
section "Release pipeline"

run_step "Changeset version" bunx changeset version

sleep 2

DATETIME=$(date +"%d-%m-%Y %H:%M:%S")
run_step "Commit release changes" git commit -am "release: $DATETIME"

run_step "Push commits" git push --quiet

run_step "Create release tags" bunx changeset tag

section "Push tags"
for tag in $(git tag --points-at HEAD); do
  info "Pushing tag: $tag"
  output_start
  if git push --quiet --no-follow-tags origin "$tag"; then
    output_end
    ok "Tag pushed: $tag"
  else
    output_end
    error "Failed to push tag: $tag"
  fi
done

section "Release result"
ok "Release process completed"
