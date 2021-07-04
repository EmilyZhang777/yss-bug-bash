#!/bin/bash

set -e

hostname=$(cat pages.json | jq -r .hostname)

if [ "$hostname" = "" ] || [ "$hostname" = "null" ]
then
  echo "Skipping sites-cfg validation, no hostname found in pages.json"
  exit
fi

pushd .. > /dev/null

sites-cfg -d=$hostname -m=prod validate

popd > /dev/null
