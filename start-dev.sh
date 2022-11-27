#!/bin/bash

jobs=
trap 'kill -HUP $jobs' INT TERM HUP
    cd ./packages/client && yarn start & jobs="$jobs $!"
    cd ./packages/server && yarn start:dev & jobs="$jobs $!"
wait