const hre = require("hardhat");

//const FACTORY_NONCE = 1; //starts at 1 since spurious Dragon
const FACTORY_ADDRESS = "0x801Bd2EA0640b9323b420206F151C2cE8F8d5873";
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; //From https://docs.alchemy.com/reference/eth-supportedentrypoints
const PM_ADDRESS = "0xdAC77b7092fa659e1c08f18F758EeB08009EF74C";


async function main() {

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  // const sender = await hre.ethers.getCreateAddress({
  //   from: FACTORY_ADDRESS,
  //   nonce: FACTORY_NONCE,
  // });

  //CREATE: hash(deployer + nonce)
  //CREATE2: hash(0xFF + sender + bytecode + salt) more detemerinistic. no nonce
  
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory"); //ether function to  deploy contracts
  const [signer0, signer1] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();
  let initCode = //"0x";
    FACTORY_ADDRESS + 
    AccountFactory.interface
        .encodeFunctionData("createAccount", [address0]) //target method in ABI. encode calldata. Signer can be the firs tacc in local chain
        .slice(2);

  let sender;
  try {
    await entryPoint.getSenderAddress(initCode);
  }
  catch(ex) {
    sender = "0x" + ex.data.slice(-40); //data.data for local hardhat
  }
  
  // instead of the commenting out
  const code = await ethers.provider.getCode(sender);
  if(code !== "0x") {
    initCode = "0x";
  }

  console.log({ sender });

  const Account = await hre.ethers.getContractFactory("Account");
  const userOp = {
        sender,//sc address
        nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16), // nonce managed by entrypoint.
        initCode,
        callData: Account.interface.encodeFunctionData("execute"), //not tx calldata. but from tje smart acc
        paymasterAndData: PM_ADDRESS, //"0x"
        signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c" //"0x" //not important now, not validating
    };

    // callGasLimit: //400_000,
    // verificationGasLimit: //400_000,
    // preVerificationGas: //100_000,
    // maxFeePerGas: //hre.ethers.parseUnits("10", "gwei"),
    // maxPriorityFeePerGas: //hre.ethers.parseUnits("5", "gwei"),

    const {preVerificationGas, verificationGasLimit, callGasLimit} = await ethers.provider.send("eth_estimateUserOperationGas", [
      userOp,
      EP_ADDRESS,
    ])

    userOp.preVerificationGas = preVerificationGas;
    userOp.verificationGasLimit = verificationGasLimit
    userOp.callGasLimit = callGasLimit

    const {maxFeePerGas} = await ethers.provider.getFeeData();
    //console.log(response);

    userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

    const maxPriorityFeePerGas = await ethers.provider.send("rundler_maxPriorityFeePerGas");
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

    const userOpHash = await entryPoint.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

    const OpHash = await ethers.provider.send("eth_sendUserOperation", [userOp, EP_ADDRESS]);
    console.log(OpHash);


    setTimeout( async () => {
      const { transactionHash}  = await ethers.provider.send("eth_getUserOperationByHash", [OpHash]);
      console.log(transactionHash);
    }, 5000);

    // const tx = await entryPoint.handleOps([userOp], address0);
    // const receipt = await tx.wait();
    // console.log(receipt);
  }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
