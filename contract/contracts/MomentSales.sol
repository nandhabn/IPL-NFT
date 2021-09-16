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

    event momentSold(address from, address to, uint256 tokenId);

    constructor(address contractAddress) {
        IPLT = IBEP20(contractAddress);
    }

    function setIPLToken(address contractAddress) public onlyOwner {
        IPLT = IBEP20(contractAddress);
    }

    function createSale(uint256 tokenId, uint256 price)
        public
        returns (uint256)
    {
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

    function getSaleById(uint256 saleId)
        public
        view
        returns (Sale memory sale)
    {
        sale = sales[saleId];
    }

    function buyMoment(uint256 saleId) public {
        Sale memory saleData = getSaleById(saleId);
        require(!saleData.saleDone, "Buy moment Failed");

        IPLT.transferFrom(_msgSender(), saleData.seller, saleData.price);
        _transfer(saleData.seller, _msgSender(), saleData.tokenId);

        saleData.saleDone = true;
        _endSale(saleId);

        emit momentSold(saleData.seller, _msgSender(), saleData.tokenId);
    }

    function checkSaleInProgressOf(uint256 tokenId)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < totalSales(); i++) {
            if (sales[i].tokenId == tokenId && !sales[i].saleDone) {
                return true;
            }
        }
        return false;
    }

    function _endSale(uint256 saleId) internal {
        sales[saleId].saleDone = true;
    }

    function totalSales() public view returns (uint256) {
        return sales.length;
    }
}
