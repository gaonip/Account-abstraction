require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
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
