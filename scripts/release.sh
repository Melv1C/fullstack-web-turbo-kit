#!/bin/bash
set -e

echo "🚀 Starting release process..."
echo

echo "📦 Running changeset version..."
bunx changeset version

sleep 1

DATETIME=$(date +"%d-%m-%Y %H:%M:%S")
echo "📝 Committing release changes ($DATETIME)..."
git commit -am "release: $DATETIME"

echo "⬆️  Pushing commits to remote..."
git push --quiet
echo

echo "🏷️  Creating release tags..."
bunx changeset tag
echo

echo "📤 Pushing new tags one by one..."
for tag in $(git tag --points-at HEAD); do
  echo "   → Pushing tag: $tag ..."
  if git push --quiet --no-follow-tags origin "$tag"; then
    echo "      ✅ Tag $tag pushed successfully!"
  else
    echo "      ❌ Failed to push tag $tag!"
  fi
done

echo
echo "🎉 Release process completed successfully!"
