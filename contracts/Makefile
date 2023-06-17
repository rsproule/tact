
chain:;  anvil -m 'test test test test test test test test test test test junk'

lint :; solhint src/**/*.sol && solhint src/*.sol

format :; prettier --write src/**/*.sol && prettier --write src/*.sol

update:; forge update

build:; forge build

deploy-anvil:;
	forge script script/TankGameDeployer.s.sol:TankGameDeployerScript --rpc-url http://localhost:8545  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

fill-game:;
	forge script script/FillGame.s.sol:FillGameScript --rpc-url http://localhost:8545 --broadcast 

deploy-testnet:;
	forge script script/TankGameDeployer.s.sol:TankGameDeployerScript\
	 --rpc-url https://rpc.tenderly.co/fork/344d077b-9dcb-42e3-b3fd-bea2a05f8dae  \
	 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
	 --broadcast