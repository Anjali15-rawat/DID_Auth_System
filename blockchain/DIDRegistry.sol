// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    struct Identity {
        string did;
        address owner;
    }

    mapping(address => Identity) public identities;

    function registerDID(string memory _did) public {
        identities[msg.sender] = Identity(_did, msg.sender);
    }

    function getDID(address _user) public view returns (string memory, address) {
        Identity memory identity = identities[_user];
        return (identity.did, identity.owner);
    }
}