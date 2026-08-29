// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Wrapped TMR (Testnet)
/// @notice 1 wTMR represents 1 TMR locked on the TMR Testnet bridge.
/// @dev Minting is restricted to the bridge/owner. This contract is for TESTNET.
contract WrappedTMR is ERC20, Ownable {
    mapping(bytes32 => bool) public processedDeposits;

    event DepositMinted(bytes32 indexed depositId, address indexed to, uint256 amount);
    event BurnRequested(bytes32 indexed withdrawalId, address indexed from, uint256 amount, string tmrAddress);

    constructor(address initialOwner)
        ERC20("Wrapped TMR", "wTMR")
        Ownable(initialOwner)
    {}

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /// @notice Mint wTMR after a verified TMR Testnet deposit.
    function mintFromTMR(bytes32 depositId, address to, uint256 amount) external onlyOwner {
        require(!processedDeposits[depositId], "deposit already processed");
        require(to != address(0), "invalid recipient");
        require(amount > 0, "amount is zero");

        processedDeposits[depositId] = true;
        _mint(to, amount);
        emit DepositMinted(depositId, to, amount);
    }

    /// @notice Burn wTMR and create a withdrawal request for the TMR Testnet.
    function burnForTMR(uint256 amount, string calldata tmrAddress)
        external
        returns (bytes32 withdrawalId)
    {
        require(amount > 0, "amount is zero");
        require(bytes(tmrAddress).length > 0, "TMR address required");

        _burn(msg.sender, amount);

        withdrawalId = keccak256(
            abi.encodePacked(block.chainid, address(this), msg.sender, amount, tmrAddress, block.timestamp)
        );

        emit BurnRequested(withdrawalId, msg.sender, amount, tmrAddress);
    }
}