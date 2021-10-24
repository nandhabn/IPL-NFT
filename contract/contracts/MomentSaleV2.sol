// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./MomentAccessControl.sol";
import "./IPLToken.sol";

contract MomentSaleV2 is ERC1155, MomentAccessControl {
  IBEP20 FT;

  // Mapping from token ID to sale price
  mapping(uint256 => uint256) private sales;

  constructor(address contractAddress) ERC1155("https://ipfs.io/ipfs/{id}") {
    FT = IBEP20(contractAddress);
  }

  function setFT(address contractAddress) public onlyOwner {
    FT = IBEP20(contractAddress);
  }

  function createSale(
    address from,
    uint256 tokenId,
    uint256 salePrice
  ) public {
    require(
      balanceOf(from, tokenId) == 1,
      "MomentSaleV2: Insufficient balance"
    );
    sales[tokenId] = salePrice;
  }

  function createToken(uint256 initialSupply) public {
    // mint(address(this), )

  }
}
