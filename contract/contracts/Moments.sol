// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./MomentAccessControl.sol";

contract IPLMoments is IERC721, MomentAccessControl {
    string public _name = "IPLMoments";
    string public _symbol = "IPLM";

    struct Moment {
        uint256 seriesId;
        string url;
        uint256 momentId;
        uint8 tokenType;
    }

    Moment[] internal moments;
    uint256 internal seriesId = 0;

    uint256 private _totalSupply = 0;
    mapping(uint256 => address) private momentsOwners;
    mapping(address => uint256) private ownershipTokenCount;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    mapping(uint8 => uint256) private _tokenType;

    event momentCreated(uint256 seriesId, string url, uint256 tokenId);

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function createMoment(string memory _url, uint8 tokenType)
        public
        onlyMinter
    {
        uint256 momentId;
        uint256 tokenCount = 0;
        // uint256 totalCount =
        for (; tokenCount < 0; tokenCount++) {
            Moment memory newMoment = Moment({
                seriesId: seriesId,
                url: _url,
                tokenType: tokenType,
                momentId: momentId
            });
            moments.push(newMoment);
            uint256 newTokenId = moments.length - 1;
            momentsOwners[newTokenId] = minter();

            _totalSupply++;
            ownershipTokenCount[minter()]++;
        }

        emit momentCreated(seriesId, _url, momentId);
    }

    function startNextSeries() public {
        seriesId++;
    }

    function getSeriesId() public view returns (uint256) {
        return seriesId;
    }

    function balanceOf(address owner)
        public
        view
        override(IERC721)
        returns (uint256 balance)
    {
        balance = ownershipTokenCount[owner];
    }

    function getMomentById(uint256 _tokenId)
        public
        view
        returns (Moment memory)
    {
        return moments[_tokenId];
    }

    function getMomentsOfOwnerByIndex(address _owner, uint256 _index)
        public
        view
        returns (uint256)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < _totalSupply; i++) {
            if (momentsOwners[i] == _owner) {
                if (count == _index) {
                    return i;
                } else {
                    count++;
                }
            }
        }
        revert();
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function ownerOf(uint256 tokenId)
        public
        view
        override(IERC721)
        returns (address owner)
    {
        owner = momentsOwners[tokenId];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return momentsOwners[tokenId] != address(0);
    }

    function setApprovalForAll(address operator, bool approved)
        public
        override(IERC721)
    {
        require(operator != _msgSender(), "ERC721: approve to caller");

        _operatorApprovals[_msgSender()][operator] = approved;
        emit ApprovalForAll(_msgSender(), operator, approved);
    }

    function getApproved(uint256 tokenId)
        public
        view
        override(IERC721)
        returns (address approvedTo)
    {
        require(
            _exists(tokenId),
            "ERC721: approved query for nonexistent token"
        );

        approvedTo = _tokenApprovals[tokenId];
    }

    function approve(address to, uint256 tokenId) public override(IERC721) {
        require(to != address(0));
        require(ownerOf(tokenId) == _msgSender());

        _tokenApprovals[tokenId] = to;
        emit Approval(_msgSender(), to, tokenId);
    }

    function isApprovedForAll(address owner, address operator)
        public
        view
        override(IERC721)
        returns (bool)
    {
        return _operatorApprovals[owner][operator];
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        require(
            _exists(tokenId),
            "ERC721: operator query for nonexistent token"
        );
        address owner = this.ownerOf(tokenId);
        return (spender == owner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender));
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external virtual override {
        transferFrom(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public virtual override(IERC721) onlyMinter {
        require(_isApprovedOrOwner(_from, _tokenId), "User not autorized");
        _transfer(_from, _to, _tokenId);
        emit Transfer(_from, _to, _tokenId);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        ownershipTokenCount[_to]++;
        momentsOwners[_tokenId] = _to;

        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        pure
        override
        returns (bool)
    {
        return true;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) public override {}
}
