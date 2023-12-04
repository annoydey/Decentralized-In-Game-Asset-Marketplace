# Blockchain Dapp -project
Game Asset Marketplace - [Live Link](https://game-asset-marketplace.netlify.app/)

## All the ERC1155 functionalities I have used in my smart contract
- GameBit and GameItem: both these contracts, are used to represent the fungible and
non-fungible aspects of our game assets
- retreiveListings: gathers information from all tokenIds, including address owner, price it is
listed at and uri. Returns array of listings. Used for front end to save all listed items and
information about them to dynamically update homepage
- List Function is utilized to list a game asset for sale. It checks whether the item is listed or not.The listings mapping is employed to store the seller’s address, the price, and other details associated with the listed item.
- updateListing Function allows the owner of a listed item to update its price. It checks if the item is listed and if the caller is the owner.
- Delist Function is used to remove the listed item from the market. It sets the seller’s address[0] and the price to 0. It checks if the item is listed or not and if the caller is the owner.
- buySellItem Function is used for purchase of a game asset. It transfers the ownership of the
NFT (gameItem.transferFrom) and transfers the payment in the form of
tokens(gameBit.transferFrom). The function checks if the buyer has enough funds before
proceeding.


## Technology Used    
* Smart Contract (Solidity Programming Language)
* Vite + React
* Hardhat
* Tailwind css
* Ether.js
* Infura
* Netlify

## Some Screenshots of Website
![p1](https://github.com/annoydey/Decentralized-In-Game-Asset-Marketplace/assets/43465122/d9e94023-3893-4a86-a3ab-437f8ff93385)
![p2](https://github.com/annoydey/Decentralized-In-Game-Asset-Marketplace/assets/43465122/27d4c59c-2e40-4780-95c0-e8126631591f)
![p3](https://github.com/annoydey/Decentralized-In-Game-Asset-Marketplace/assets/43465122/0ffd3974-d612-4e8d-bb27-659b92120cac)
![p4](https://github.com/annoydey/Decentralized-In-Game-Asset-Marketplace/assets/43465122/12ea3fc7-0cf1-4489-8a91-606cf6bcb80c)


## Steps for Deployment

Testing on Hardhat Localhost
1. Download DApp folder
2. Go into market-contract
3. Type ‘npm install’
4. Type ‘npx hardhat compile’
5. Type ’npx hardhat node’
6. Go to the same directory in a new terminal
7. Type ‘npx hardhat run .\scripts\deploy.js --network localhost’
8. Go market-app, client
9. Type ‘npm install’
10.Type ‘npm run dev’
11. Open up provided link

Deploying to Sepolia Testnet
1. Download DApp folder
2. Go into market-contract
3. Type ‘npm install’
4. Make sure hardhat.config.js has correct Infura API Url and deployer private key
5. Type ‘npx hardhat compile’
6. Type npx hardhat run .\scripts\deploy.js --network sepolia’
7. Go to market-app/client
8. Type ‘npm install’
9. Type ‘npm run build’
10.Use ‘dist’ folder in market-app to deploy front-end on Netlify
11. Open up provided link

TODO:
- Add events with popup
    - Need to do: buy
- Implement batchOf function?

