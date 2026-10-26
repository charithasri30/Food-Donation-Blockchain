
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FoodDonation {
    address public owner;
    address public ngo;

    enum Status {
        Registered,
        ReceivedByNGO,
        InTransit,
        Distributed
    }

    struct Donation {
        uint256 id;
        address donor;
        string foodName;
        uint256 quantity;
        string expiryDate;
        string pickupLocation;
        Status status;
        uint256 createdAt;
    }

    uint256 public donationCount;

    mapping(uint256 => Donation) public donations;

    event DonationRegistered(
        uint256 indexed id,
        address indexed donor,
        string foodName
    );

    event StatusUpdated(
        uint256 indexed id,
        Status status
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    modifier onlyNGO() {
        require(msg.sender == ngo, "Only NGO allowed");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setNGO(address _ngo) external onlyOwner {
        require(_ngo != address(0), "Invalid NGO address");
        ngo = _ngo;
    }

    function registerDonation(
        string calldata _foodName,
        uint256 _quantity,
        string calldata _expiryDate,
        string calldata _pickupLocation
    ) external {
        require(bytes(_foodName).length > 0, "Food name required");
        require(_quantity > 0, "Quantity must be positive");
        require(bytes(_expiryDate).length > 0, "Expiry date required");
        require(bytes(_pickupLocation).length > 0, "Location required");

        donationCount++;

        donations[donationCount] = Donation({
            id: donationCount,
            donor: msg.sender,
            foodName: _foodName,
            quantity: _quantity,
            expiryDate: _expiryDate,
            pickupLocation: _pickupLocation,
            status: Status.Registered,
            createdAt: block.timestamp
        });

        emit DonationRegistered(
            donationCount,
            msg.sender,
            _foodName
        );
    }

    function updateStatus(
        uint256 _id,
        Status _status
    ) external onlyNGO {
        require(_id > 0 && _id <= donationCount, "Invalid donation ID");

        Donation storage donation = donations[_id];

        require(
            uint256(_status) == uint256(donation.status) + 1,
            "Invalid status transition"
        );

        donation.status = _status;

        emit StatusUpdated(_id, _status);
    }

    function getDonation(
        uint256 _id
    ) external view returns (Donation memory) {
        require(_id > 0 && _id <= donationCount, "Invalid donation ID");
        return donations[_id];
    }
}
