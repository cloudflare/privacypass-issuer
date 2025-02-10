#!/bin/bash

# Step 1: Remove dist directory
rm -rf dist

# Step 2: Run npm build
npm run build

# Check if npm run build was successful
if [ $? -eq 0 ]; then
  # If npm build succeeded, run the following git commands:
  gaa && gcan! && git push --force myfork $(git branch --show-current) && gcopy
else
  echo "Build failed, aborting git commands."
  exit 1
fi

