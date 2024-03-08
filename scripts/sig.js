const hre = require("hardhat");

async function main() {

  const [signer0] = await hre.ethers.getSigners();
  const signature = signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("wee")));
  //keccak hash of it and turn into utf8 bytes and this needs to be a uint8 array.
    
  const Test = await hre.ethers.getContractFactory("Test");
  const test = await Test.deploy(signature)

  console.log("address0", await signer0.getAddress()); //frontend address needs to be the same

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
