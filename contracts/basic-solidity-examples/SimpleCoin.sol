// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import { MinerAPI } from "@zondax/filecoin-solidity/contracts/v0.8/MinerAPI.sol";
import { MinerTypes } from "@zondax/filecoin-solidity/contracts/v0.8/types/MinerTypes.sol";
import { PrecompilesAPI } from "@zondax/filecoin-solidity/contracts/v0.8/PrecompilesAPI.sol";

error SimpleCoin__NotEnoughBalance();

contract SimpleCoin {
        mapping (address => uint) balances;
        uint256 private i_tokensToBeMinted;
        bytes public owner;
        bytes public returnValue;


        constructor(uint256 tokensToBeMinted) {
                balances[tx.origin] = tokensToBeMinted;
                i_tokensToBeMinted= tokensToBeMinted;
        }

        function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
                if (balances[msg.sender] < amount) {
                        // return false;
                revert SimpleCoin__NotEnoughBalance();
                }

                balances[msg.sender] -= amount;
                balances[receiver] += amount;
                return true;
        }

        function getBalanceInEth(address addr) public view returns(uint){
                return getBalance(addr) * 2;
        }

        function getBalance(address addr) public view returns(uint) {
                return balances[addr];
        }

        function getMintedTokenBalance() public view returns(uint256){
                return i_tokensToBeMinted;
        }

        function getOwner(bytes memory target) public  {
                // require(target[0] == 0x00 || target[0] == 0x01 || target[0] == 0x02 || target[0] == 0x03 || target[0] == 0x04, "actor_address address should be bytes format");
                owner = MinerAPI.getOwner(target).owner;
        }

        function getOwnerDebug(bytes memory minerActorAddr) public {
                MinerTypes.GetOwnerReturn memory or = MinerAPI.getOwner(minerActorAddr);
                returnValue = or.owner;
        }

}