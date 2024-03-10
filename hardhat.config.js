require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "arb",
  networks: {
    arb: {
      url: `${process.env.RPC_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.19",
    settings: { // Second important change for large solidity files
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    }
  }
};
