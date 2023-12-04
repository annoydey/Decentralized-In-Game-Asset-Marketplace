// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract GameItem is ERC721URIStorage {

    // DATA
    uint256 private _nextTokenId;

    address chairperson;
    mapping(address => bool) minters;

    // MODIFIERS
    modifier onlyChair() {
        require(msg.sender == chairperson, "Only chairperson can perform this action");
        _;
    }

    modifier onlyMinter() {
        require(minters[msg.sender], "Only minter can perform this action");
        _;
    }

    // EVENTS
    event Minted(uint tokenId);
    event MinterRegistered(address indexed newMinter);
    event MinterUnregistered(address indexed removedMinter);

    // FUNCTIONS
    constructor() ERC721("GameItem", "ITM") {
        _nextTokenId = 0;
        chairperson = msg.sender;
        minters[chairperson] = true;
    }

    function regMinter(address newMinter) onlyChair() public {
        minters[newMinter] = true;
        emit MinterRegistered(newMinter);
    }

    function unregMinter(address removeMinter) onlyChair() public {
        minters[removeMinter] = false;
        emit MinterUnregistered(removeMinter);
    }

    function mintItem(address receiver, string memory tokenURI) onlyMinter() external returns (uint256 tokenId) {
        tokenId = _nextTokenId++;
        _mint(receiver, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit Minted(tokenId);
        return tokenId;
    }

}