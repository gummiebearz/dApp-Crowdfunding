require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.0',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/0a05aa1f111741dd83a61c310ba6fc6d',
      accounts: ['6b4ff9cc67f6ab87f4b39c8d96639addc2ac4cfc92f8089b20fb99a7a13ece24'],
      chainId: 3
    }
  }
};

// 0x2a2Ad9181598EadA8f74E9a0C98f491fF7B61cD8 -- ropsten
// 0x5FbDB2315678afecb367f032d93F642f64180aa3 -- localhost