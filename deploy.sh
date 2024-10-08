#!/bin/bash

# Initialize variables
CONFIG_FILE=""

# Parse command line arguments
while getopts ":c:" opt; do
  case $opt in
    c)
      CONFIG_FILE="-c $OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# Read .env file
set -a
source .env.deploy
set +a

# Construct build args string
BUILD_ARGS=""
for var in "${!NEXT_PUBLIC_@}"; do
  BUILD_ARGS="$BUILD_ARGS --build-arg $var=${!var}"
done

# Deploy with build args and optional config file
echo "Deploying with command: fly deploy $CONFIG_FILE $BUILD_ARGS"
fly deploy $CONFIG_FILE $BUILD_ARGS