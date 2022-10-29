// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IBEP20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IPLToken is IBEP20, Ownable {
    string private _name = "IPLToken";
    string private _symbol = "IPLT";
    uint256 private _totalSupply;
    uint256 private _tokensCount;
    mapping(address => uint256) private _balance;
    mapping(address => mapping(address => uint256)) private _allowance;

    constructor() {
        _totalSupply = 50000;
        _balance[_msgSender()] = _totalSupply;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function getOwner() public view override returns (address) {
        return owner();
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balance[account];
    }

    function transfer(address recipient, uint256 amount)
        public
        override
        returns (bool)
    {
        require(_balance[_msgSender()] >= amount);

        _balance[_msgSender()] -= amount;
        _balance[recipient] += amount;

        return true;
    }

    function mint(uint256 count) public onlyOwner {
        require(_tokensCount <= totalSupply());
        _balance[owner()] += count;
        _tokensCount += count;
    }

    function allowance(address _owner, address _spender)
        public
        view
        override
        returns (uint256)
    {
        return _allowance[_owner][_spender];
    }

    function approve(address spender, uint256 amount)
        public
        override
        returns (bool)
    {
        require(_balance[_msgSender()] >= amount);

        _allowance[_msgSender()][spender] = amount;

        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        require(_balance[sender] >= amount);
        require(_isApprovedOrOwner(sender, _msgSender(), amount), "");

        if (_msgSender() != sender) {
            _allowance[sender][_msgSender()] -= amount;
        }

        _balance[sender] -= amount;
        _balance[recipient] += amount;

        return true;
    }

    function _isApprovedOrOwner(
        address _owner,
        address _spender,
        uint256 _amount
    ) public view returns (bool) {
        return (_msgSender() == _owner ||
            allowance(_owner, _spender) >= _amount);
    }
}
