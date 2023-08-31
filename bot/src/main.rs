use std::{sync::Arc, thread, time::Duration};

use clap::Parser;
use ethers::{
    prelude::abigen,
    providers::{Http, Provider},
    signers::LocalWallet,
    types::{Address, Chain},
};
use ethers::{prelude::SignerMiddleware, types::U256};
use ethers_signers::Signer;
use hexx::Hex;
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    #[arg(long)]
    game_address: String,

    #[arg(long)]
    game_view_address: String,

    #[arg(short, long)]
    rpc: String,

    #[arg(short, long)]
    private_key: String,

    #[arg(short, long)]
    strategy: String,
}

#[derive(Clone, Debug, PartialEq, Eq)]
enum BotStrategy {
    Attack,
    Medic,
    Hoard,
}
abigen!(TankGame, "../contracts/out/TankGameV2.sol/TankGame.json");
abigen!(ITankGame, "../contracts/out/ITankGame.sol/ITankGame.json");
abigen!(GameView, "../contracts/out/GameView.sol/GameView.json");

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let args = Args::parse();
    let game_address: Address = args.game_address.parse()?;
    let game_view_address: Address = args.game_view_address.parse()?;
    let rpc = args.rpc;
    let strat = match args.strategy.as_str() {
        "attack" => BotStrategy::Attack,
        "medic" => BotStrategy::Medic,
        "hoard" => BotStrategy::Hoard,
        _ => panic!("Invalid strategy must be "),
    };

    let provider = Arc::new(Provider::<Http>::try_from(rpc)?);
    let wallet: LocalWallet = args
        .private_key
        .parse::<LocalWallet>()?
        .with_chain_id(Chain::AnvilHardhat);

    let client = SignerMiddleware::new(provider.clone(), wallet.clone());
    let game_contract = TankGame::new(game_address, Arc::new(client));
    let game_view_contract = GameView::new(game_view_address, provider.clone());
    // let i_game_contract = ITankGame::new(game_address, provider.clone());

    let mut bot_tank_id = game_contract.players(wallet.address()).await?;

    // while the game is not over and the bot is still alive
    let mut game_state = game_contract.state().await?;
    loop {
        if bot_tank_id == U256::zero() {
            bot_tank_id = game_contract.players(wallet.address()).await?;
        }
        match game_state {
            0 => {
                println!("waiting for game to start: {}", game_state);
                match game_contract.join(vec![U256::zero().into()], "klebus".to_string()).send().await {
                    Ok(pending_tx) => {
                        println!("sent join tx");
                        let result = pending_tx.await;
                        println!("join tx mined: {:?}", result);
                    }
                    Err(e) => {
                        println!("error joining game: {}", e);
                    }
                }
            }
            1 => {
                println!("game started: {}", game_state);
                // do live game stuff
                handle_game(bot_tank_id, &game_view_contract, &game_contract, &strat).await?;
            }
            2 => {
                println!("game ended: {}", game_state);
                // TODO: try to claim
                return Ok(());
            }
            _ => {
                println!("unknown game state: {}", game_state);
                return Err(anyhow::anyhow!("unknown game state: {}", game_state));
            }
        }
        game_state = game_contract.state().await?;
        thread::sleep(Duration::from_secs(5));
    }
}

async fn handle_game<P, S>(
    bot_id: U256,
    game_view_contract: &GameView<P>,
    game: &TankGame<S>,
    strategy: &BotStrategy,
) -> anyhow::Result<()>
where
    P: ethers::providers::Middleware + 'static,
    S: ethers::providers::Middleware + 'static,
{
    let tanks: Vec<TankLocation> = game_view_contract.get_all_tanks().await?;
    let bot_tank = game.get_tank(bot_id).await?;
    let id: usize = bot_id.as_usize();
    if id == 0 {
        println!("bot id is 0, something is wrong. Tanks: {:?}", tanks);
        return Err(anyhow::anyhow!("bot id is 0, something is wrong"));
    }
    let bot_tank_location = tanks[id - 1].clone();
    let board_size = game.get_settings().call().await?.board_size;

    // alive stuff (drip, move, give, shoot, upgrade)

    if bot_tank.hearts > U256::zero() {
        // try to drip
        match game.drip(bot_id).send().await {
            Ok(pending_tx) => {
                println!("sent drip tx");
                let result = pending_tx.await;
                println!("drip tx mined: {:?}", result);
            }
            Err(e) => {
                println!("error dripping: {}", e);
            }
        }
        let (nearest_tank_id, nearest_tank, distance) =
            find_nearest_tank(bot_id, &tanks, matches!(strategy, BotStrategy::Attack));
        // some contrived strategy here to decide between aggro/friendly give/shoot
        // if we have no aps, should just give up
        if bot_tank.aps > U256::zero() {
            match strategy {
                BotStrategy::Attack => {
                    // find the nearest person, go towards them and try to shoot them
                    if distance > bot_tank.range {
                        // move toward, slightly complex use the hex math here
                        let to = traverse_towards(
                            bot_tank_location.position,
                            nearest_tank.position,
                            board_size.as_usize() as i32,
                            distance - bot_tank.range,
                        )
                        .expect("unable to get move to coordinates");
                        println!("tank: {:?}, moving to {:?}", id, to);
                        match game.move_(bot_id, to).send().await {
                            Ok(pending_tx) => {
                                println!("sent move tx");
                                let result = pending_tx.await;
                                println!("move tx mined: {:?}", result);
                            }
                            Err(e) => {
                                println!("error move : {}", e);
                            }
                        }
                    } else {
                        // shoot!
                        println!("tank: {:?}, shooting {:?}", id, nearest_tank_id);
                        match game
                            .shoot(
                                bot_id,
                                U256::from(nearest_tank_id),
                                U256::min(nearest_tank.tank.hearts, bot_tank.aps),
                            )
                            .send()
                            .await
                        {
                            Ok(pending_tx) => {
                                println!("sent shoot tx");
                                let result = pending_tx.await;
                                println!("shoot tx mined: {:?}", result);
                            }
                            Err(e) => {
                                println!("error shoot: {}", e);
                            }
                        }
                    }
                }
                BotStrategy::Medic => {
                    if distance > bot_tank.aps {
                        // move towards
                        let to = traverse_towards(
                            bot_tank_location.position,
                            nearest_tank.position,
                            board_size.as_usize() as i32,
                            distance - bot_tank.aps,
                        )
                        .expect("unable to get move to coordinates");
                        match game.move_(bot_id, to).send().await {
                            Ok(pending_tx) => {
                                println!("sent move tx");
                                let result = pending_tx.await;
                                println!("move tx mined: {:?}", result);
                            }
                            Err(e) => {
                                println!("error move : {}", e);
                            }
                        }
                    } else if nearest_tank.tank.hearts == U256::from(3) {
                        // give ap
                        match game
                            .give(
                                bot_id,
                                U256::from(nearest_tank_id),
                                U256::zero(),
                                U256::from(1),
                            )
                            .send()
                            .await
                        {
                            Ok(pending_tx) => {
                                println!("give ap tx");
                                let result = pending_tx.await;
                                println!("give ap tx mined: {:?}", result);
                            }
                            Err(e) => {
                                println!("error give ap: {}", e);
                            }
                        }
                    } else {
                        // give heart
                        match game
                            .give(
                                bot_id,
                                U256::from(nearest_tank_id),
                                U256::from(1),
                                U256::zero(),
                            )
                            .send()
                            .await
                        {
                            Ok(pending_tx) => {
                                println!("give heart tx");
                                let result = pending_tx.await;
                                println!("give heart tx mined: {:?}", result);
                            }
                            Err(e) => {
                                println!("error give heart: {}", e);
                            }
                        }
                    }
                }
                BotStrategy::Hoard => {
                    // all this mf does is upgrade range
                    if distance > bot_tank.range {
                        match game.upgrade(bot_id).send().await {
                            Ok(pending_tx) => {
                                println!("upgrade tx");
                                let result = pending_tx.await;
                                println!("upgrade tx mined: {:?}", result);
                            }
                            Err(e) => {
                                println!("error upgrade: {}", e);
                            }
                        }
                    } else {
                        // shoot!
                        println!("tank: {:?}, shooting {:?}", id, nearest_tank_id);
                        match game
                            .shoot(
                                bot_id,
                                U256::from(nearest_tank_id),
                                U256::min(nearest_tank.tank.hearts, bot_tank.aps),
                            )
                            .send()
                            .await
                        {
                            Ok(pending_tx) => {
                                println!("sent shoot tx");
                                let result = pending_tx.await;
                                println!("shoot tx mined: {:?}", result);
                            }
                            Err(e) => {
                                println!("error shoot: {}", e);
                            }
                        }
                    }
                }
            }
        }
    }

    // dead stuff (vote)
    if bot_tank.hearts <= U256::zero() {
        let alive_tanks = tanks
            .iter()
            .filter(|tl| tl.tank.hearts > U256::zero())
            .collect::<Vec<&TankLocation>>();
        // try to vote
        let cursed = alive_tanks.first().unwrap();
        let cursed_id = tanks.iter().position(|r| r == *cursed).unwrap();
        match game.vote(bot_id, U256::from(cursed_id + 1)).send().await {
            Ok(pending_tx) => {
                println!("sent vote tx");
                let result = pending_tx.await;
                println!("vote tx mined: {:?}", result);
            }
            Err(e) => {
                println!("error vote: {}", e);
            }
        }
    }

    // always stuff
    match game.reveal().send().await {
        Ok(pending_tx) => {
            println!("sent reveal tx");
            let result = pending_tx.await;
            println!("drip tx mined: {:?}", result);
        }
        Err(e) => {
            println!("error dripping: {}", e);
        }
    }
    Ok(())
}

fn traverse_towards(
    a: game_view::Point,
    b: game_view::Point,
    r: i32,
    distance: U256,
) -> Option<tank_game::Point> {
    // see if we can find a crate to do this for us
    // draw a line, index into the line via len
    let ax = a.x.as_usize() as i32 - r;
    let ay = a.y.as_usize() as i32 - r;
    let az = a.z.as_usize() as i32 - r;
    let bx = b.x.as_usize() as i32 - r;
    let by = b.y.as_usize() as i32 - r;
    let bz = b.z.as_usize() as i32 - r;
    let a = Hex::new_cubic(ax, ay, az);
    let b = Hex::new_cubic(bx, by, bz);
    let line = a.line_to(b).collect::<Vec<Hex>>();

    let v = line.get(distance.as_usize());
    v.map(|v| tank_game::Point {
        x: U256::from(v.x + r),
        y: U256::from(v.y + r),
        z: U256::from(v.z() + r),
    })
}

fn find_nearest_tank(
    tank_id: U256,
    tanks: &[TankLocation],
    alive: bool,
) -> (usize, TankLocation, U256) {
    // tank ids index from 0
    let id: usize = tank_id.as_usize();
    let my_tank = tanks[id - 1].clone();
    let mut nearest_tank_id = if id == 1 { 2 } else { 1 };
    let mut nearest_tank = tanks[nearest_tank_id - 1].clone();
    let mut nearest_distance = distance(&my_tank, &nearest_tank);
    let mut first_loop = true;
    println!("nearest distance: {:?}", nearest_distance);
    for (i, tank) in tanks.iter().enumerate() {
        if i == id - 1 {
            continue;
        }
        if alive && tank.tank.hearts == U256::zero() {
            continue;
        }
        if !alive && tank.tank.hearts > U256::zero() {
            continue;
        }

        let distance = distance(&my_tank, tank);
        if distance < nearest_distance || first_loop {
            first_loop = false;
            nearest_tank = tank.clone();
            nearest_tank_id = i + 1;
            nearest_distance = distance;
        }
    }
    println!(
        "for {:?}, nearest tank is {:?} at distance {:?}",
        tank_id, nearest_tank_id, nearest_distance
    );
    (nearest_tank_id, nearest_tank, nearest_distance)
}

fn distance(a: &TankLocation, b: &TankLocation) -> U256 {
    let a = &a.position;
    let b = &b.position;

    let dx = if a.x > b.x { a.x - b.x } else { b.x - a.x };
    let dy = if a.y > b.y { a.y - b.y } else { b.y - a.y };
    let dz = if a.z > b.z { a.z - b.z } else { b.z - a.z };
    (dx + dy + dz) / 2
}
