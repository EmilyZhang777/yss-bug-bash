#!/bin/bash

set -e

# GENERATOR TODO: Need a much better way to do this :/  perhaps an env variable that contains the path to soy2jslinux?
if [ ! -f "soy2jslinux" ]
then
  GOOS=linux go build -o soy2jslinux yext/pages/sites/scripts/soy2js
fi

# Need to map node_modules elsewhere due to incompatible OSX and Linux node modules.
tmpnodemodules=`mktemp -d /tmp/pgs.node/XXXXXXXX`
mkdir -p /tmp/docker-yarn-cache

docker build -t pages-build .

# Map the root of the pages site directory
docker run \
  -v $(dirname $(dirname $(pwd))):/site \
  -v /tmp/docker-yarn-cache:/usr/local/share/.cache/yarn \
  -v $tmpnodemodules:/site/src/node_modules \
  pages-build

rm -rf $tmpnodemodules
