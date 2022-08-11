#!/usr/bin/env sh
git fetch
git checkout live
git fetch
git merge main
git push
git checkout main
