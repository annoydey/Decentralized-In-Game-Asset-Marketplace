require("@nomicfoundation/hardhat-toolbox");

const SEPOLIA_URL_KEY = "https://sepolia.infura.io/v3/a2db97898802468fb8f695398ec23b68";

const SEPOLIA_PRIVATE_KEY = "91163c3c2ca9eba99c797ab3ed621d457f77f4867cf4ee4c08f47986b82b95b7";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
    url: SEPOLIA_URL_KEY,
    accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
