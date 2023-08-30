"use client";
import { useAccount } from "wagmi";
import * as tree from "public/tree.json";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { getAddress } from "viem";

export default function TestJoinPage() {
  const merkleTree = StandardMerkleTree.load(tree as any);
  const { address } = useAccount();
  const value = tree.values.find((x) => getAddress(x.value[0]) === address);
  const proof =
    value &&
    merkleTree
      .getProof(value.value)
      .map((x) => Object.freeze(x) as `0x${string}`);
  return (
    <div className="container mt-10">
      {proof ? (
        <div className="bg-lime-900 p-10 text-center">
          Found <b>{value.value[1]}</b>, you are ready to go. Good luck,
          soldier.
        </div>
      ) : (
        <div className="bg-red-900 p-10 text-center">
          Not Found. check you are connecting the correct wallet, or contact
          ryan
          <div className="mt-2">Expected addresses:</div>
          <div>
            {tree.values.map((x) => (
              <>
                {x.value[1] + " = " + x.value[0] + "\n"}
                <br />
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
