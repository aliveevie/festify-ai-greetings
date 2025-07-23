// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Festify {
    uint256 private _tokenIdCounter = 1;

    // tokenId => owner
    mapping(uint256 => address) public ownerOf;

    // owner => number of tokens
    mapping(address => uint256) public balanceOf;

    // tokenId => approved address
    mapping(uint256 => address) public getApproved;

    // tokenId => token URI
    mapping(uint256 => string) private _tokenURIs;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    modifier onlyOwner(uint256 tokenId) {
        require(msg.sender == ownerOf[tokenId], "Not token owner");
        _;
    }

    function name() public pure returns (string memory) {
        return "festivalgreetings";
    }

    function symbol() public pure returns (string memory) {
        return "FGRTS";
    }

    function mint(address to, string memory metadataURI) public returns (uint256) {
    require(to != address(0), "Invalid address");
    uint256 tokenId = _tokenIdCounter++;

    ownerOf[tokenId] = to;
    balanceOf[to] += 1;
    _tokenURIs[tokenId] = metadataURI;

    emit Transfer(address(0), to, tokenId);
    return tokenId;
}


    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(ownerOf[tokenId] != address(0), "Nonexistent token");
        return _tokenURIs[tokenId];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(from == ownerOf[tokenId], "From is not owner");
        require(to != address(0), "Cannot transfer to zero");
        require(msg.sender == from || msg.sender == getApproved[tokenId], "Not authorized");

        // Clear approval
        getApproved[tokenId] = address(0);

        // Transfer
        balanceOf[from] -= 1;
        balanceOf[to] += 1;
        ownerOf[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) public onlyOwner(tokenId) {
        getApproved[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }
}
