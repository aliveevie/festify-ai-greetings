// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {Festify} from "../src/Festify.sol";

contract FestifyScript is Script {
    function setUp() public {}

    function run() public {
        // Get private key from environment
        string memory privateKeyStr = vm.envString("PRIVATE_KEY");
        
        // Add 0x prefix if not present
        uint256 deployerPrivateKey;
        if (bytes(privateKeyStr).length > 0) {
            // Check if it already has 0x prefix
            if (bytes(privateKeyStr)[0] == '0' && bytes(privateKeyStr)[1] == 'x') {
                deployerPrivateKey = vm.parseUint(privateKeyStr);
            } else {
                // Add 0x prefix
                string memory prefixedKey = string(abi.encodePacked("0x", privateKeyStr));
                deployerPrivateKey = vm.parseUint(prefixedKey);
            }
        } else {
            revert("PRIVATE_KEY environment variable is empty");
        }
        
        vm.startBroadcast(deployerPrivateKey);
        
        Festify festify = new Festify();
        
        console.log("===========================================");
        console.log("Festify contract deployed successfully!");
        console.log("===========================================");
        console.log("Contract Address:", address(festify));
        console.log("Contract Name:", festify.name());
        console.log("Contract Symbol:", festify.symbol());
        console.log("Supports ERC721:", festify.supportsInterface(0x80ac58cd));
        console.log("Supports ERC721Metadata:", festify.supportsInterface(0x5b5e139f));
        console.log("Total Supply:", festify.totalSupply());
        console.log("===========================================");
        console.log("View on Explorer:");
        console.log("https://hyperion-testnet-explorer.metisdevops.link/address/%s", address(festify));
        console.log("===========================================");
        
        vm.stopBroadcast();
    }
}
