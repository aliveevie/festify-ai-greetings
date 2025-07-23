// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Festify} from "../src/Festify.sol";

contract FestifyScript is Script {
    Festify public festify;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        festify = new Festify();
        console.log("Festify deployed at:", address(festify));

        vm.stopBroadcast();
    }
}
