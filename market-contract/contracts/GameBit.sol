// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GameBit is ERC20 {
    event TokensMinted(address indexed to, uint256 amount);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);
    
    constructor(uint256 initialSupply) ERC20("GameBit", "GBT") {
        _mint(msg.sender, initialSupply * (10**18));
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        emit TokensTransferred(msg.sender, to, amount);
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        emit TokensTransferred(from, to, amount);
        return super.transferFrom(from, to, amount);
    }
}
