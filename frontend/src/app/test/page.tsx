"use client";
import { useAccount } from "wagmi";
import * as tree from "public/tree.json";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export default function TestJoinPage() {
  const merkleTree = StandardMerkleTree.load(tree as any);
  const { address } = useAccount();
  const value = tree.values.find((x) => x.value[0] === address);
  console.log(value);
  return (
    <div className="container mt-10">
      {value ? (
        <div className="bg-lime-900 p-10 text-center">
          Found, you are ready to go <b>{value.value[1]}</b>
        </div>
      ) : (
        <div className="bg-red-900 p-10 text-center">
          Not Found. check you are connecting the correct wallet, or contact
          ryan
        </div>
      )}
    </div>
  );
}
