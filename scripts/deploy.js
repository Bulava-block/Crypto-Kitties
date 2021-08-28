async function main() {
    // We get the contract to deploy
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, Hardhat!");
  
     const Kittycontract = await ethers.getContractFactory("Kittycontract");
     const cryptkit = await Kittycontract.deploy();
  
     const KittyMarketPlace = await ethers.getContractFactory("KittyMarketPlace");
     const marketPlace = await KittyMarketPlace.deploy(cryptkit.address);
  
     console.log("Greeter deployed to:", greeter.address);
     console.log("Kittycontract deployed to:", cryptkit.address)
     console.log("marketPlace deployed to:", marketPlace.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });