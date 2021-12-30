//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Collection is Initializable, ERC1155Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
    using Counters for Counters.Counter;

    uint256 private _counter;
    Counters.Counter private _lastId;

    function __Collection_init(string memory uri_) external initializer {
        __Ownable_init_unchained();
        __ERC1155_init_unchained(uri_);
    }

    function mintTo(address receiver_) external {
        _lastId.increment();
        uint256 id = _lastId.current();

        _mint(receiver_, id, 1, "");
    }

    function lastId() external view returns (uint256) {
        return _lastId.current();
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        require(msg.sender == owner(), "Collection: wrong upgrader");
    }
}
