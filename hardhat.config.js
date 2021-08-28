require("@nomiclabs/hardhat-waffle");
//let secret =require("./secret");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.5.12",
  
  networks:{
    ropsten:{
      url:"https://speedy-nodes-nyc.moralis.io/17e7fc6b12b8853d5f7efbd0/eth/ropsten",
      accounts:["4963171f458d1581e76a323a5e2bbf0c6f585cc78173d7c93d32f8002f332ac9"]
    }
  }
};
