#!/bin/bash
cd contracts && make chain > /dev/null &
cd contracts && make deploy-anvil && cd ..
cd bot && make  run-test-fleet
