// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const ACC_address = "0x493b260843d146e916f7178f8f726ad7662f19f4"; //make sure to change this sender address!!!
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDRESS = "0xdAC77b7092fa659e1c08f18F758EeB08009EF74C";



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
