const hre = require("hardhat");

//const FACTORY_NONCE = 1; //starts at 1 since spurious Dragon
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; //From https://docs.alchemy.com/reference/eth-supportedentrypoints
const PM_ADDRESS = "0xdAC77b7092fa659e1c08f18F758EeB08009EF74C";


async function main() {

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  await entryPoint.depositTo(PM_ADDRESS, {
    value: ethers.parseEther(".2"),
  })

  console.log("deposit was succesful")
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
