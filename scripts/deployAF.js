const hre = require("hardhat");

async function main() {
  //entrypoint
  // const ep = await hre.ethers.deployContract("EntryPoint");

  // await ep.waitForDeployment();

  // console.log(
  //   `EP deployed to ${ep.target}`
  // );

  //account factory
  const af = await hre.ethers.deployContract("AccountFactory");

  await af.waitForDeployment();

  console.log(
    `AF deployed to ${af.target}`
  );


  //Paymaster
  const pm = await hre.ethers.deployContract("Paymaster");

  await pm.waitForDeployment();

  console.log(
    `PM deployed to ${pm.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
