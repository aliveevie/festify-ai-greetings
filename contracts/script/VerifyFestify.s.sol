// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

contract VerifyFestify is Script {
    // Contract address on Metis Hyperion testnet
    address constant FESTIFY_CONTRACT = 0xD9BF55E8bC7642AE6931A94ac361559C2F34298e;
    
    function run() public {
        console.log("Contract to verify:");
        console.log("Address:", FESTIFY_CONTRACT);
        console.log("Chain ID: 133717 (Metis Hyperion Testnet)");
        console.log("Block Explorer: https://hyperion-testnet-explorer.metisdevops.link");
        
        console.log("\nTo verify this contract, run:");
        console.log("forge verify-contract --chain-id 133717 --watch");
        console.log("  --etherscan-api-key $ETHERSCAN_API_KEY");
        console.log("  --verifier-url https://hyperion-testnet-explorer.metisdevops.link");
        console.log("  0xD9BF55E8bC7642AE6931A94ac361559C2F34298e");
        console.log("  src/Festify.sol:Festify");
    }
} 