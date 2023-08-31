
for i in `seq 1 20`
do
    echo "funding $i"
    pk=0x00000000000000000000000000000000000000000000000000000000000000$i
    if [ $i -lt 10 ]; then
        pk=0x000000000000000000000000000000000000000000000000000000000000000$i
    fi
    # if cast send --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 $(cast wallet address --mnemonic mnemonic --mnemonic-derivation-path m/44'/60'/0'/0'/$i) --value 1ether ; then
    if cast send --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 $(cast wallet address $pk) --value 1ether ; then
        echo "Funded $i"
    else
        echo "Command failed for $i"
    fi
done