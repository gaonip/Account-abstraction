// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const ACC_address = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";



async function main() {

  const account = await hre.ethers.getContractAt("Account", ACC_address)
  const count = await account.count();
  console.log(count);

  //check EP
  console.log("account balance", await hre.ethers.provider.getBalance(ACC_address));

  const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
  console.log("account balance on EP", await ep.balanceOf(ACC_address));

  //check PM
  console.log("account balance on EP", await ep.balanceOf(PM_ADDRESS));


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
