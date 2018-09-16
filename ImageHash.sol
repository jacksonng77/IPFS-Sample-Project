pragma solidity ^0.4.17;
contract ImageHash {
    string ipfsHash;
 
    event savedHash(
        
    );
    
    function setHash(string x) public {
        ipfsHash = x;
        emit savedHash();
    }

    function getHash() public view returns (string x) {
        return ipfsHash;
    }
}
