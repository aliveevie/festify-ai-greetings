// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Festify} from "../src/Festify.sol";

contract FestifyTest is Test {
    Festify public festify;
    address public user1;
    address public user2;

    function setUp() public {
        festify = new Festify();
        user1 = address(0x1);
        user2 = address(0x2);
    }

    function test_Name() public view {
        assertEq(festify.name(), "festivalgreetings");
    }

    function test_Symbol() public view {
        assertEq(festify.symbol(), "FGRTS");
    }

    function test_Mint() public {
        string memory metadataURI = "https://example.com/token/1";
        uint256 tokenId = festify.mint(user1, metadataURI);
        
        assertEq(tokenId, 1);
        assertEq(festify.ownerOf(tokenId), user1);
        assertEq(festify.balanceOf(user1), 1);
        assertEq(festify.tokenURI(tokenId), metadataURI);
    }

    function test_Transfer() public {
        string memory metadataURI = "https://example.com/token/1";
        uint256 tokenId = festify.mint(user1, metadataURI);
        
        vm.prank(user1);
        festify.transferFrom(user1, user2, tokenId);
        
        assertEq(festify.ownerOf(tokenId), user2);
        assertEq(festify.balanceOf(user1), 0);
        assertEq(festify.balanceOf(user2), 1);
    }

    function test_Approve() public {
        string memory metadataURI = "https://example.com/token/1";
        uint256 tokenId = festify.mint(user1, metadataURI);
        
        vm.prank(user1);
        festify.approve(user2, tokenId);
        
        assertEq(festify.getApproved(tokenId), user2);
    }
}
