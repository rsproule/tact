// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/TankGame.sol";
import "../src/ITankGame.sol";

contract FillGameScript is Script {
    TankGame public tankGame;

    function run() public {
        vm.startBroadcast();
        spreadFunds();
        // tankGame = TankGame(0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e);
        // initGame();
    }

    function initGame() public {
        uint playerCount = tankGame.settings().playerCount;
        for (uint160 i = 1; i < playerCount; i++) {
            // payable(address(i)).transfer(1 ether);
            vm.prank(address(i));
            tankGame.join();
        }
    }

    function spreadFunds() public {
        payable(0x5337122c6b5ce24D970Ce771510D22Aeaf038C44).transfer(1 ether);
        payable(0x0a0023dac7C84CE586952760bbF283dc3D3DcE25).transfer(1 ether);
        payable(0x7A0F795a88c738030CE674537C2D2882D894cB45).transfer(1 ether);
        payable(0xBE14E59b52EF62A6a2cFfA4D041C0127262efDa9).transfer(1 ether);
        payable(0xD2fbd311fcc1dc3f025FAa8D8E07DF2Cf56164c2).transfer(1 ether);
        payable(0xcC19C0F5a36147adf1A8EA884ee422c7eC5B832B).transfer(1 ether);
        payable(0x8EFf08FA0C048Cf29e172e72D76DA30108579F3C).transfer(1 ether);
        payable(0x5fc1256F07E962205CF9acaC9bE0c929F60A4328).transfer(1 ether);
        payable(0xc916c5c2Ae0224720066D2AdA96f3c1c698Ca68d).transfer(1 ether);
        payable(0xcC19C0F5a36147adf1A8EA884ee422c7eC5B832B).transfer(1 ether);
    }
}
