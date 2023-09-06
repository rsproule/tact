use std::fs;

use ethers::types::{Address, U256};
use merkle_tree_rs::standard::{LeafType, StandardMerkleTree, StandardMerkleTreeData};
use serde_json::Value;

fn camel_to_snake(s: &str) -> String {
    s.chars()
        .map(|c| {
            if c.is_uppercase() {
                format!("_{}", c.to_ascii_lowercase())
            } else {
                c.to_string()
            }
        })
        .collect()
}

fn convert_keys(value: &mut Value, converter: &dyn Fn(&str) -> String) {
    match value {
        Value::Object(map) => {
            let old_keys: Vec<String> = map.keys().cloned().collect();
            for old_key in old_keys {
                if let Some(mut val) = map.remove(&old_key) {
                    convert_keys(&mut val, converter);
                    let new_key = converter(&old_key);
                    map.insert(new_key, val);
                }
            }
        }
        Value::Array(arr) => {
            for v in arr {
                convert_keys(v, converter);
            }
        }
        _ => {}
    }
}

pub fn get_merkle_proof(path: String, address: Address) -> anyhow::Result<(Vec<[u8; 32]>, String)> {
    let tree_json = fs::read_to_string(path).unwrap();
    let mut value: Value = serde_json::from_str(&tree_json).unwrap();
    convert_keys(&mut value, &camel_to_snake);

    let converted_json_str = serde_json::to_string_pretty(&value).unwrap();

    let tree_data: StandardMerkleTreeData = serde_json::from_str(&converted_json_str).unwrap();

    let tree = StandardMerkleTree::load(tree_data);

    for (i, v) in tree.clone().enumerate() {
        let v_ad = v[0].parse::<Address>()?;
        if v_ad == address {
            let proof = tree.get_proof(LeafType::Number(i));
            let converted_proof: Result<Vec<[u8; 32]>, _> = proof
                .into_iter()
                .map(|x| x.parse::<U256>())
                .map(|x| x.map(|x| x.into()))
                .collect();
            return Ok((converted_proof?, v[1].clone()));
        }
    }
    Err(anyhow::anyhow!("address not found in whitelist"))
}
