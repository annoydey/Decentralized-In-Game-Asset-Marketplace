// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');

async function main() {

  // deploy GameBit smart contract
  const GameBit = await hre.ethers.getContractFactory("GameBit");
  const gameBit = await GameBit.deploy(1000);
  await gameBit.waitForDeployment();
  console.log("GameBit deployed:", gameBit.target);

  // deploy GameItem smart contract
  const GameItem = await hre.ethers.getContractFactory("GameItem");
  const gameItem = await GameItem.deploy();
  await gameItem.waitForDeployment();
  console.log("GameItem deployed:", gameItem.target);

  // deploy GameAssetMarket smart contract
  const GameAssetMarket = await hre.ethers.getContractFactory("GameAssetMarket");
  const gameAssetMarket = await GameAssetMarket.deploy(gameBit.target, gameItem.target);
  await gameAssetMarket.waitForDeployment();
  console.log("GameAssetMarket deployed:", gameAssetMarket.target);

  const addresses = {
    GameBit: gameBit.target,
    GameItem: gameItem.target,
    GameAssetMarket: gameAssetMarket.target
  }

  fs.writeFileSync('contractAddresses.json', JSON.stringify(addresses))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
