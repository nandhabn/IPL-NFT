// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Moments.sol";
import "./IPLToken.sol";

contract MomentSale is IPLMoments {
  struct Sale {
    address seller;
    uint256 price;
    uint256 tokenId;
    uint256 saleId;
    bool saleDone;
  }

  Sale[] private sales;
  IBEP20 IPLT;

  mapping(address => uint256) private redeemGasCost;
  mapping(address => uint256) private redeemPackCost;
  mapping(address => uint256[]) private redeemMoments;

  event momentSold(address from, address to, uint256 tokenId);

  constructor(address contractAddress) {
    IPLT = IBEP20(contractAddress);
  }

  function setIPLToken(address contractAddress) public onlyOwner {
    IPLT = IBEP20(contractAddress);
  }

  function createSale(uint256 tokenId, uint256 price) public returns (uint256) {
    require(ownerOf(tokenId) == _msgSender(), "Token unauthorised");
    require(!checkSaleInProgressOf(tokenId), "Moment is already in sale");

    uint256 newSaleId = sales.length;

    Sale memory newSale = Sale({
      seller: _msgSender(),
      price: price,
      tokenId: tokenId,
      saleId: newSaleId,
      saleDone: false
    });

    sales.push(newSale);
    return newSaleId;
  }

  function getSaleById(uint256 saleId) public view returns (Sale memory sale) {
    sale = sales[saleId];
  }

  function buyMoment(uint256 saleId) public {
    Sale memory saleData = getSaleById(saleId);

    require(
      ownerOf(saleData.tokenId) != _msgSender(),
      "Owner can not buy moment"
    );

    require(!saleData.saleDone, "Buy moment Failed");

    IPLT.transferFrom(_msgSender(), saleData.seller, saleData.price);
    _transfer(saleData.seller, _msgSender(), saleData.tokenId);

    saleData.saleDone = true;
    _endSale(saleId);

    emit momentSold(saleData.seller, _msgSender(), saleData.tokenId);
  }

  function checkSaleInProgressOf(uint256 tokenId) internal view returns (bool) {
    for (uint256 i = 0; i < totalSales(); i++) {
      if (sales[i].tokenId == tokenId && !sales[i].saleDone) {
        return true;
      }
    }
    return false;
  }

  function endSale(uint256 saleId) public {
    Sale memory sale = sales[saleId];

    require(
      ownerOf(sale.tokenId) == _msgSender(),
      "Unauthorized action: Token owner can only end sale"
    );

    _endSale(saleId);
  }

  function _endSale(uint256 saleId) internal {
    sales[saleId].saleDone = true;
  }

  function totalSales() public view returns (uint256) {
    return sales.length;
  }

  function getRedeemCost(address user)
    public
    view
    returns (uint256 gasCost, uint256 packCost)
  {
    gasCost = redeemGasCost[user];
    packCost = redeemPackCost[user];
  }

  function redeemPack() public payable {
    uint256 gasCost = redeemGasCost[_msgSender()];
    uint256 packCost = redeemPackCost[_msgSender()];

    require(gasCost <= msg.value, "redeem failed: insufficient balance");
    require(
      packCost <= IPLT.balanceOf(_msgSender()),
      "redeem failed: insufficient balance"
    );

    require(payable(address(owner())).send(gasCost));
    require(
      IPLT.allowance(_msgSender(), address(this)) >= packCost,
      "Allowance is less than "
    );
    IPLT.transferFrom(_msgSender(), owner(), packCost);

    redeemGasCost[_msgSender()] = 0;
    redeemPackCost[_msgSender()] = 0;
    uint256[] memory momentsToRedeem = redeemMoments[_msgSender()];
    for (uint8 index = 0; index < momentsToRedeem.length; index++) {
      _transfer(minter(), _msgSender(), momentsToRedeem[index]);
    }
    delete momentsToRedeem;
  }

  function mintAndTransferPack(
    uint256[] memory playIDs,
    uint256 packPrice,
    address to
  ) public onlyMinter returns (uint256[] memory) {
    require(redeemGasCost[to] == 0, "Finish previous transation");
    uint256[] memory tokenIds = new uint256[](playIDs.length);
    for (uint256 index = 0; index < playIDs.length; index++) {
      uint256 newTokenId = _mint(playIDs[index]);
      tokenIds[index] = newTokenId;
    }
    redeemPackCost[to] += packPrice;
    redeemMoments[to] = tokenIds;
    redeemGasCost[to] += tx.gasprice;
    return tokenIds;
  }
}
