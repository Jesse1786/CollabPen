#!/bin/bash

# building the frontend image
docker build --squash -t frontend -f frontend.dockerfile .

# building the backend image
docker build --squash -t backend -f backend.dockerfile .

# stop all containers
docker compose down --remove-orphans

# remove dangling images
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
