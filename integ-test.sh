#!/bin/bash
cd contracts && make chain > /dev/null &
cd contracts && make deploy-anvil && cd .. 
cd bot && make fund-test-fleet && make run-test-fleet
