const hre = require("hardhat");

const FACTORY_NONCE = 1; //starts at 1 since spurious Dragon
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";


async function main() {

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });

  //CREATE: hash(deployer + nonce)
  //CREATE2: hash(0xFF + sender + bytecode + salt) more detemerinistic. no nonce
  
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory"); //ether function to  deploy contracts
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();
  const initCode = "0x";
    // FACTORY_ADDRESS + 
    // AccountFactory.interface
    //     .encodeFunctionData("createAccount", [address0]) //target method in ABI. encode calldata. Signer can be the firs tacc in local chain
    //     .slice(2);

  console.log({ sender });

  // await entryPoint.depositTo(PM_ADDRESS, {
  //   value: ethers.parseEther("100"),
  // })
  
  const Account = await hre.ethers.getContractFactory("Account");
  const userOp = {
        sender,//sc address
        nonce: await entryPoint.getNonce(sender, 0), // nonce managed by entrypoint.
        initCode,
        callData: Account.interface.encodeFunctionData("execute"), //not tx calldata. but from tje smart acc
        callGasLimit: 200_000,
        verificationGasLimit: 200_000,
        preVerificationGas: 50_000,
        maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
        paymasterAndData: PM_ADDRESS,
        signature: "0x" //not important now, not validating
    };

    const tx = await entryPoint.handleOps([userOp], address0);
    const receipt = await tx.wait();
    console.log(receipt);
  }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
