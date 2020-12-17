#!/bin/bash

set -e

docker-compose build
docker-compose run --rm authentication bash -c "yarn"
docker-compose run --rm calendar bash -c "yarn"
docker-compose run --rm core bash -c "yarn"
docker-compose run --rm courses bash -c "yarn"
docker-compose run --rm frontend bash -c "yarn"
docker-compose run --rm notification bash -c "yarn"
docker-compose run --rm unibz_gateway bash -c "yarn"
docker-compose run --rm unitn_gateway bash -c "yarn"
docker-compose run --rm universities_gateway bash -c "yarn"
docker-compose run --rm user bash -c "yarn"
