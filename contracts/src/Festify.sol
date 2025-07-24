// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool approved) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

interface IERC721Metadata {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

contract Festify is IERC165, IERC721, IERC721Metadata {
    uint256 private _tokenIdCounter = 1;

    // tokenId => owner
    mapping(uint256 => address) public override ownerOf;

    // owner => number of tokens
    mapping(address => uint256) public override balanceOf;

    // tokenId => approved address
    mapping(uint256 => address) public override getApproved;

    // owner => operator => approved
    mapping(address => mapping(address => bool)) public override isApprovedForAll;

    // tokenId => token URI
    mapping(uint256 => string) private _tokenURIs;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    modifier onlyOwner(uint256 tokenId) {
        require(msg.sender == ownerOf[tokenId], "Not token owner");
        _;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    function name() public pure override returns (string memory) {
        return "Festify Greetings";
    }

    function symbol() public pure override returns (string memory) {
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

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf[tokenId] != address(0), "Nonexistent token");
        return _tokenURIs[tokenId];
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(from == ownerOf[tokenId], "From is not owner");
        require(to != address(0), "Cannot transfer to zero");
        require(
            msg.sender == from || 
            msg.sender == getApproved[tokenId] || 
            isApprovedForAll[from][msg.sender], 
            "Not authorized"
        );

        // Clear approval
        getApproved[tokenId] = address(0);

        // Transfer
        balanceOf[from] -= 1;
        balanceOf[to] += 1;
        ownerOf[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) public override {
        address owner = ownerOf[tokenId];
        require(to != owner, "Approval to current owner");
        require(msg.sender == owner || isApprovedForAll[owner][msg.sender], "Not authorized");

        getApproved[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public override {
        require(operator != msg.sender, "Approve to caller");
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        transferFrom(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, data), "Transfer to non ERC721Receiver");
    }

    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory data) private returns (bool) {
        if (to.code.length > 0) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("Transfer to non ERC721Receiver");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return ownerOf[tokenId] != address(0);
    }
}

interface IERC721Receiver {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
}
