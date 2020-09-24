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
  git -c user.name="$CDN_USER" -c user.email='camperbot@users.noreply.github.com' \
    commit -m 'chore(travis-CI): update testable-projects-fcc bundle'
  git push https://"$CDN_USER":"$CDN_API_KEY"@github.com/"$CDN_REPO_SLUG" master
fi
popd
