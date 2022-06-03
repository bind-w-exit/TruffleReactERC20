// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20Mintable.sol";

contract EVAToken is ERC20Mintable {
    constructor() ERC20Mintable("Evangelion", "EVA") public {}

    function mint(address account, uint256 amount) public onlyMinter override returns (bool) {
        uint256 totalSuppleBefore = totalSupply();
        _mint(account, amount);
        emit TotalSuppleChanged(totalSuppleBefore, totalSupply());
        return true;
    }

    event TotalSuppleChanged(uint256 totalSuppleBefore, uint256 TotalSuppleAfter);
}