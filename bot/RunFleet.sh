for i in `seq 1 21`
do
    if [ $i -eq 0 ]; then
        mode=hoard
    elif [ $i -eq 1 ]; then
        mode=attack
    else
        mode=medic
    fi
    pk=0x00000000000000000000000000000000000000000000000000000000000000$i
    if [ $i -lt 10 ]; then
        pk=0x000000000000000000000000000000000000000000000000000000000000000$i
    fi
    
    cargo run -- \
    --game-address 0xa16E02E87b7454126E5E10d957A927A7F5B5d2be \
    --game-view-address 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 \
    --rpc http://localhost:8545 \
    --private-key $pk \
    --strategy $mode &
done