// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./Crowdfunding.sol";

contract CrowdfundingApp {
    address public immutable creator;
    uint256 private totalFunds;
    mapping(address => Funds) private fundings;

    struct Funds {
        Crowdfunding[] fundsList;
    }

    constructor() {
        creator = msg.sender;
    }

    function createCrowdfunding(
        uint256 goal,
        uint256 deadline,
        uint256 minContribution,
        string memory ipfsHash
    ) public returns (address) {
        Crowdfunding fund = new Crowdfunding(
            msg.sender,
            goal,
            deadline,
            minContribution,
            ipfsHash
        );
        fundings[msg.sender].fundsList.push(fund);
        totalFunds++;

        return address(fund);
    }

    function getTotalNoFunds() public view returns (uint256) {
        return totalFunds;
    }

    function getUserFundsList() public view returns (Crowdfunding[] memory) {
        return fundings[msg.sender].fundsList;
    }

    function getUserNoFunds() public view returns (uint256) {
        return fundings[msg.sender].fundsList.length;
    }
}
