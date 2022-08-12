// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Crowdfunding {
    // ---------------------------
    // STATE VARIABLES
    // ---------------------------
    // mapping address to value sent from msg.sender to hash table
    mapping(address => uint256) public contributors;

    // manager/ admin of campaign
    address public admin;

    // ipfsHash containing contract metadata
    string ipfsHash;

    // no of contributors
    uint256 public noOfContributors;

    // min contribution per transaction
    uint256 public minContribution;

    // deadline for a campaign
    uint256 public deadline; // timestamp in secs

    // monetary goal for a campaign
    uint256 public goal;

    // total amount raised for a campaign
    uint256 public raisedAmount;

    // spending request struct
    struct SpendingRequest {
        string description;
        address payable recipient;
        uint256 value; // in wei
        bool completed;
        uint256 noOfVoters; // no of contributors voting for the request
        mapping(address => bool) voters;
    }

    // mapping the index of array to a SpendingRequest
    mapping(uint256 => SpendingRequest) public spendingRequests;

    // no of spending requests (also the index key of mapping above)
    uint256 noOfSpendingRequests;

    // ---------------------------
    // EVENTS
    // ---------------------------
    event Contribute(address indexed sender, uint256 value);
    event CreateRequest(string description, address recipient, uint256 value);
    event SpendingRequestCompleted(address indexed recipient, uint256 value);
    event RequestFund(address indexed contributor, uint256 value);

    // ---------------------------
    // MODIFIERS
    // ---------------------------
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    // ---------------------------
    constructor(
        address _admin,
        uint256 _goal,
        uint256 _deadline,
        uint256 _minContribution,
        string memory _ipfsHash
    ) {
        goal = _goal;
        deadline = _deadline;
        minContribution = _minContribution;
        admin = _admin;
        ipfsHash = _ipfsHash;
    }

    // receiving contributions directly
    receive() external payable {
        contribute();
    }

    // contribute ethers to campaign
    function contribute() public payable {
        require(block.timestamp < deadline, "Deadline has already passed");
        require(
            msg.value >= minContribution,
            "Minimum contribution was not met"
        );

        // add the contributor to the contributors hash table if not already in
        if (contributors[msg.sender] == 0) {
            noOfContributors++;
        }

        // add the contributed value to the contributor's balance
        contributors[msg.sender] += msg.value;

        // update the total raised amount
        raisedAmount += msg.value;

        // log event
        emit Contribute(msg.sender, msg.value);
    }

    // get campaign's balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // get campaign's total raised amount (different from balance)
    function getTotalRaisedAmount() public view returns (uint256) {
        return raisedAmount;
    }

    // get ipfsHash
    function getIpfsHash() public view returns (string memory) {
        return ipfsHash;
    }

    // initiate a spending request
    function createSpendingRequest(
        string memory _description,
        address payable _recipient,
        uint256 _value
    ) public onlyAdmin {
        // assign a new request to the mapping spendingRequests
        SpendingRequest storage newRequest = spendingRequests[
            noOfSpendingRequests
        ];

        // update the total requests
        noOfSpendingRequests++;

        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.completed = false;
        newRequest.noOfVoters = 0;

        // log event
        emit CreateRequest(_description, _recipient, _value);
    }

    // vote for a spending request
    function voteSpendingRequest(uint256 _requestNo) public {
        require(
            msg.sender != admin,
            "Admin cannot vote for his/ her own spending request"
        );
        require(
            contributors[msg.sender] > 0,
            "You must become a contributor to vote"
        );

        // get the request at given index from mapping
        SpendingRequest storage request = spendingRequests[_requestNo];

        // check if the current contributor has already voted
        require(
            request.voters[msg.sender] == false,
            "You have already voted for this spending request"
        );

        // set the voting status to true
        request.voters[msg.sender] = true;

        // increment no of voters
        request.noOfVoters++;
    }

    // spend the requested ether from a spending request
    function useSpendingRequest(uint256 _requestNo) public onlyAdmin {
        // check if goal is reached
        require(raisedAmount >= goal, "Goal has not been reached");

        SpendingRequest storage request = spendingRequests[_requestNo];
        // check if this spending request has been fulfilled
        require(
            request.completed == false,
            "This spending requested has been fulfilled"
        );

        // check if there are more than 50% voters
        require(
            request.noOfVoters >= noOfContributors / 2,
            "Must be voted by more than 50% contributors"
        );

        // transfer the ether to recipient of request
        request.recipient.transfer(request.value);
        // mark the request as fulfilled
        request.completed = true;

        // log event
        emit SpendingRequestCompleted(request.recipient, request.value);
    }

    // request refund if campaign fails
    function requestFund() public {
        require(
            block.timestamp > deadline && raisedAmount < goal,
            "Deadline has not passed and goal has not been reached"
        );
        require(contributors[msg.sender] > 0, "You are not the contributor"); // contributor has positive balance

        address payable recipient = payable(msg.sender);
        uint256 value = contributors[msg.sender];
        recipient.transfer(value);

        // reset the contributor's amt to 0
        contributors[msg.sender] = 0;

        // log event
        emit RequestFund(msg.sender, value);
    }
}
