//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Counter is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 private _counter;

    function __Counter_init() external initializer {
        __Ownable_init();
    }

    function increment() external {
        _counter++;
    }

    function readCounter() external view returns (uint256) {
        return _counter;
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        require(msg.sender == owner(), "C: wrong upgrader");
    }
}
