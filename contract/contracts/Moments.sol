// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./MomentAccessControl.sol";

contract IPLMoments is IERC721, MomentAccessControl {
  string public _name = "IPLMoments";
  string public _symbol = "IPLM";

  struct Moment {
    uint256 playID;
    uint256 serialNumber;
  }

  struct Play {
    string url;
    uint8 tokenType;
  }

  Moment[] internal moments;
  Play[] internal plays;

  uint256 private _totalSupply = 0;
  mapping(uint256 => address) private momentsOwners;
  mapping(address => uint256) private ownershipTokenCount;
  mapping(uint256 => address) private _tokenApprovals;
  mapping(address => mapping(address => bool)) private _operatorApprovals;
  mapping(uint256 => uint256) private momentSNCount;
  mapping(address => uint256) private redeemCost;
  mapping(address => uint256[]) private redeemMoments;

  uint16[4] _tokenType = [
    60000, // common
    1000, //  rare
    10, //    epic
    3 //      Legendary
  ];

  event playCreated(uint256 playID, string url, uint256 tokenType);

  event momentCreated(uint256 playID, uint256 serialNumber, uint256 momentID);

  function name() public view returns (string memory) {
    return _name;
  }

  function symbol() public view returns (string memory) {
    return _symbol;
  }

  function getPlayBy(uint256 playID) public view returns (Play memory play) {
    play = plays[playID];
  }

  function getPlayCount() public view returns (uint256 count) {
    count = plays.length;
  }

  function createPlay(string memory _url, uint8 tokenType)
    public
    onlyMinter
    returns (uint256)
  {
    require(tokenType < _tokenType.length);
    Play memory newPlay = Play({ url: _url, tokenType: tokenType });
    plays.push(newPlay);
    uint256 newPlayID = plays.length;
    emit playCreated(newPlayID, _url, tokenType);
    return newPlayID;
  }

  function momentSNCountOf(uint256 playID) public view returns (uint256) {
    return momentSNCount[playID];
  }

  function _mint(uint256 playID) internal returns (uint256) {
    Play memory play = plays[playID];

    require(
      momentSNCountOf(playID) < _tokenType[play.tokenType],
      "Invalid moment type"
    );

    uint256 momentSerialNumber = momentSNCount[playID];
    momentSNCount[playID]++;

    Moment memory newMoment = Moment({
      playID: playID,
      serialNumber: momentSerialNumber
    });
    moments.push(newMoment);
    uint256 newTokenId = moments.length - 1;
    momentsOwners[newTokenId] = minter();

    _totalSupply++;
    ownershipTokenCount[minter()]++;

    emit momentCreated(playID, momentSerialNumber, newTokenId);

    return newTokenId;
  }

  function balanceOf(address _owner)
    public
    view
    override(IERC721)
    returns (uint256 balance)
  {
    balance = ownershipTokenCount[_owner];
  }

  function getMomentById(uint256 _tokenId) public view returns (Moment memory) {
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
    returns (address _owner)
  {
    _owner = momentsOwners[tokenId];
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
    require(_exists(tokenId), "ERC721: approved query for nonexistent token");

    approvedTo = _tokenApprovals[tokenId];
  }

  function approve(address to, uint256 tokenId) public override(IERC721) {
    require(to != address(0));
    require(ownerOf(tokenId) == _msgSender());

    _tokenApprovals[tokenId] = to;
    emit Approval(_msgSender(), to, tokenId);
  }

  function isApprovedForAll(address _owner, address operator)
    public
    view
    override(IERC721)
    returns (bool)
  {
    return _operatorApprovals[_owner][operator];
  }

  function _isApprovedOrOwner(address spender, uint256 tokenId)
    internal
    view
    returns (bool)
  {
    require(_exists(tokenId), "ERC721: operator query for nonexistent token");
    address _owner = this.ownerOf(tokenId);
    return (spender == _owner ||
      getApproved(tokenId) == spender ||
      isApprovedForAll(_owner, spender));
  }

  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  ) external virtual override {
    require(_to != address(0));
    transferFrom(_from, _to, _tokenId);
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  ) public virtual override(IERC721) {
    require(_isApprovedOrOwner(_from, _tokenId), "User not autorized");
    require(_to != address(0));
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

  function mintAndTransferPack(
    uint256[] memory playIDs,
    uint256 packPrice,
    address to
  ) public onlyMinter returns (uint256[] memory) {
    // require(_verify(_hash(playIDs), signature), "Invalid signature");
    require(redeemCost[to] == 0);
    uint256[] memory tokenIds = new uint256[](playIDs.length);
    for (uint256 index = 0; index < playIDs.length; index++) {
      uint256 newTokenId = _mint(playIDs[index]);
      tokenIds[index] = newTokenId;
    }
    redeemCost[to] += packPrice + tx.gasprice;
    redeemMoments[to] = tokenIds;
    return tokenIds;
  }

  function getRedeemCost(address user) public view returns (uint256 cost) {
    cost = redeemCost[user];
  }

  function redeemPack() public payable {
    uint256 cost = redeemCost[_msgSender()];
    require(cost <= msg.value, "redeem failed: insufficient balance");
    require(payable(address(owner())).send(cost));
    redeemCost[_msgSender()] -= cost;
    uint256[] memory momentsToRedeem = redeemMoments[_msgSender()];
    for (uint8 index = 0; index < momentsToRedeem.length; index++) {
      _transfer(minter(), _msgSender(), momentsToRedeem[index]);
    }
    delete momentsToRedeem;
  }

  function owner() public view override(Ownable) returns (address) {
    return super.owner();
  }

  // function withdrawEth() public payable onlyOwner {
  //   address payable receiver = payable(owner());
  //   (bool done, ) = receiver.call{ value: address(this).balance }(
  //     "IPLMoment withdrawal"
  //   );
  //   require(done);
  // }

  // Since we are not going to use lazy minting we are commenting these two block
  // function _hash(uint256[] memory playIDs) internal pure returns (bytes32) {
  //     return
  //         ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(playIDs)));
  // }

  // function _verify(bytes32 digest, bytes memory signature)
  //     internal
  //     view
  //     returns (bool)
  // {
  //     return minter() == ECDSA.recover(digest, signature);
  // }
}
