#!/bin/bash


# USAGE: ./scripts/versionBump.sh <version-bump-type>
# Running this script will make a commit with the new version and tag it with the new version.
# This will trigger the GitHub Actions workflow to publish the package to npm.

# Ensure the script exits if any command fails
set -e

# Check if a version bump type is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <version-bump-type>"
  echo "Version bump types: patch, minor, major"
  exit 1
fi

# Bump the version in package.json
yarn version $1

# Add all the package.json files in the repo
git add package.json

version=$(node -p "require('./package.json').version")
git commit -m "Bump version to $version"

# Tag the commit with @packagename@version for each package
git tag @regolithco/common@$version
