#!/bin/bash

set -e


# 'frozen-lockfile' only properly exits with a non-zero code after yarn 0.24.0 :(
yarn install --frozen-lockfile

if [ -f "bower.json" ]
then
  bower install
fi

if [ -f "Gemfile" ]
then
  bundle install
fi

yarn jsdocs

grunt build
