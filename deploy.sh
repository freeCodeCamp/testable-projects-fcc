#!/usr/bin/env bash
pushd "$TRAVIS_BUILD_DIR"
# Deploy only if $CDN_API_KEY exists and src/* was changed in the last commit
if [ -n "$CDN_API_KEY" ] && \
  git log -1 --name-only -m --pretty='format:' | grep -q '^src/'
then
  git clone https://github.com/"$CDN_REPO_SLUG"

  # Copy build files to local CDN repo
  cp -r --parents build/testable-projects-fcc/* cdn/

  # Commit and push changes to CDN repo
  cd cdn/
  git add .
  git -c user.name="$CDN_USER" -c user.email='travis' \
    commit -m 'Travis CI testable-projects-fcc'
  git push https://"$CDN_USER":"$CDN_API_KEY"@github.com/"$CDN_REPO_SLUG" master
fi
popd

