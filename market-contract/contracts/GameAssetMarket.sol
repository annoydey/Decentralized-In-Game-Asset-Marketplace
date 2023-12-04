// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./GameItem.sol";
import "./GameBit.sol";

contract GameAssetMarket {

    // DATA
    GameBit private gameBit;
    GameItem private gameItem;

    address chairperson;

    struct Listings {
        address seller;
        uint256 price;
        uint256 tokenId;
        string uri;
    }

    mapping(uint256 => Listings) private listings;
    uint[] private listingsKey;

    modifier onlyOwner(uint256 tokenId) {
        require(gameItem.ownerOf(tokenId) == msg.sender, "Only owner can perform this action");
        _;
    }

    modifier isListed(uint256 tokenId) {
        require(listings[tokenId].price != 0 && listings[tokenId].seller != address(0), "Item is not currently listed");
        _;
    }

    modifier notListed(uint256 tokenId) {
        require(listings[tokenId].price == 0 && listings[tokenId].seller == address(0), "Item is already listed");
        _;
    }

    // EVENTS
    event Listed(uint tokenId, uint price);
    event UpdateListing(uint tokenId, uint price);
    event Updatedelist(uint tokenId);
    event BuyItem(uint tokenId, uint price);

    // FUNCTIONS
    constructor(address _gameBit, address _gameItem) {
        gameBit = GameBit(_gameBit);
        gameItem = GameItem(_gameItem);
        chairperson = msg.sender;
        // minters[chairperson] = true;
    }

    function retreiveListings() public view returns (Listings[] memory) {
        Listings[] memory allListings = new Listings[](listingsKey.length);
        for (uint i = 0; i < listingsKey.length; i++) {
            allListings[i] = listings[listingsKey[i]];
        }
        return allListings;
    }

    function list(uint256 tokenId, uint256 price) notListed(tokenId) onlyOwner(tokenId) public returns (uint256) {
        // WHEN LISTING ON FRONTEND, HAVE USER CALL GAMEITEM.APPROVAL(TOKENID, THIS SC ADDRESS)
        // USER INPUT PRICE CAN BE INT OR DEC, HAVE BACKEND TAKE PRICE*(10**18) WHEN CALLING THIS FUNCTION
        
        listings[tokenId].seller = msg.sender;
        listings[tokenId].price = price;
        listings[tokenId].tokenId = tokenId;
        
        string memory uri = gameItem.tokenURI(tokenId);
        listings[tokenId].uri = uri;

        bool temp = true;
        for (uint i = 0; i < listingsKey.length; i++) {
            if (listingsKey[i] == tokenId) {
                temp = false;
            }
        }
        if (temp == true) {
            listingsKey.push(tokenId);
        }

        emit Listed(tokenId, price);
        return tokenId;
    }

    function updateListing(uint256 tokenId, uint256 price) isListed(tokenId) onlyOwner(tokenId) public returns (uint256) {
        // USER INPUT PRICE CAN BE INT OR DEC, HAVE BACKEND TAKE PRICE*(10**18) WHEN CALLING THIS FUNCTION

        listings[tokenId].price = price;

        emit UpdateListing(tokenId, price);
        return tokenId;
    }

    function delist(uint256 tokenId) isListed(tokenId) onlyOwner(tokenId) public returns (uint256) {
        // WHEN DELISTING ON FRONTEND, HAVE USER CALL GAMEITEM.APPROVAL(TOKENID, ADDRESS(0))
        // USER INPUT PRICE CAN BE INT OR DEC, HAVE BACKEND TAKE PRICE*(10**18) WHEN CALLING THIS FUNCTION

        listings[tokenId].seller = address(0);
        listings[tokenId].price = 0;

        emit Updatedelist(tokenId);
        return tokenId;
    }

    function buySellItem(address nftFrom, address nftTo, uint256 tokenId, uint256 price) external {
        // USER INPUT PRICE CAN BE INT OR DEC, HAVE BACKEND TAKE PRICE*(10**18) WHEN CALLING THIS FUNCTION
        gameItem.transferFrom(nftFrom, nftTo, tokenId);

        // WHEN BUYING ON FRONTEND, HAVE USER CALL GAMEBIT.APPROVAL(THIS SC ADDRESS, PRICE)
        // require(gameBit.balanceOf(nftTo) >= (price), "Buyer does not have enough funds");
        require(gameBit.transferFrom(nftTo, nftFrom, price), "Token transfer failed");

        listings[tokenId].seller = address(0);
        listings[tokenId].price = 0;

        emit BuyItem(tokenId, price);
    }

}