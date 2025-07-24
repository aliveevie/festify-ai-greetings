// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Festify} from "../src/Festify.sol";

contract FestifyTest is Test {
    Festify public festify;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        festify = new Festify();
    }

    function test_Name() public {
        assertEq(festify.name(), "Festify Greetings");
    }

    function test_Symbol() public {
        assertEq(festify.symbol(), "FGRTS");
    }

    function test_Mint() public {
        string memory testMetadataURI = "https://gateway.pinata.cloud/ipfs/QmTestHash";
        
        uint256 tokenId = festify.mint(user1, testMetadataURI);
        
        assertEq(tokenId, 1);
        assertEq(festify.ownerOf(tokenId), user1);
        assertEq(festify.balanceOf(user1), 1);
        assertEq(festify.tokenURI(tokenId), testMetadataURI);
    }

    function test_MintMultiple() public {
        string memory uri1 = "https://gateway.pinata.cloud/ipfs/QmTestHash1";
        string memory uri2 = "https://gateway.pinata.cloud/ipfs/QmTestHash2";
        
        uint256 tokenId1 = festify.mint(user1, uri1);
        uint256 tokenId2 = festify.mint(user2, uri2);
        
        assertEq(tokenId1, 1);
        assertEq(tokenId2, 2);
        assertEq(festify.ownerOf(tokenId1), user1);
        assertEq(festify.ownerOf(tokenId2), user2);
        assertEq(festify.tokenURI(tokenId1), uri1);
        assertEq(festify.tokenURI(tokenId2), uri2);
    }

    function test_Transfer() public {
        string memory testMetadataURI = "https://gateway.pinata.cloud/ipfs/QmTestHash";
        uint256 tokenId = festify.mint(user1, testMetadataURI);
        
        vm.prank(user1);
        festify.transferFrom(user1, user2, tokenId);
        
        assertEq(festify.ownerOf(tokenId), user2);
        assertEq(festify.balanceOf(user1), 0);
        assertEq(festify.balanceOf(user2), 1);
    }

    function test_Approve() public {
        string memory testMetadataURI = "https://gateway.pinata.cloud/ipfs/QmTestHash";
        uint256 tokenId = festify.mint(user1, testMetadataURI);
        
        vm.prank(user1);
        festify.approve(user2, tokenId);
        
        assertEq(festify.getApproved(tokenId), user2);
        
        vm.prank(user2);
        festify.transferFrom(user1, user2, tokenId);
        
        assertEq(festify.ownerOf(tokenId), user2);
    }

    function test_SupportsInterface() public {
        // ERC721 interface ID
        assertTrue(festify.supportsInterface(0x80ac58cd));
        
        // ERC721Metadata interface ID  
        assertTrue(festify.supportsInterface(0x5b5e139f));
        
        // ERC165 interface ID
        assertTrue(festify.supportsInterface(0x01ffc9a7));
    }

    function test_TotalSupply() public {
        assertEq(festify.totalSupply(), 0);
        
        festify.mint(user1, "uri1");
        assertEq(festify.totalSupply(), 1);
        
        festify.mint(user2, "uri2");
        assertEq(festify.totalSupply(), 2);
    }

    function test_TokenExists() public {
        assertFalse(festify.exists(1));
        
        festify.mint(user1, "uri1");
        assertTrue(festify.exists(1));
        assertFalse(festify.exists(2));
    }

    function testFail_MintToZeroAddress() public {
        festify.mint(address(0), "uri");
    }

    function testFail_TokenURIForNonexistentToken() public {
        festify.tokenURI(999);
    }

    function testFail_TransferFromWrongOwner() public {
        uint256 tokenId = festify.mint(user1, "uri");
        
        vm.prank(user2);
        festify.transferFrom(user2, user1, tokenId);
    }
}
