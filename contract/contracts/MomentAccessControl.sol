// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MomentAccessControl is Ownable {
    address private _minter;

    event MinterChanged(address indexed oldMinter, address indexed newMinter);

    constructor() {
        setMinter(_msgSender());
    }

    modifier onlyMinter() {
        require(_msgSender() == _minter, "Mintable: caller is not the minter");
        _;
    }

    function setMinter(address newMinter) public onlyOwner {
        address oldMinter = newMinter;
        _minter = newMinter;
        emit MinterChanged(oldMinter, newMinter);
    }

    function minter() public view returns (address) {
        return _minter;
    }
}
