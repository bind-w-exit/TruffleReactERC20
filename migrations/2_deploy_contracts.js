var EVAToken = artifacts.require("./EVAToken.sol");
var EVATokenSales = artifacts.require("./EVATokenSale.sol");
var KycContract = artifacts.require("./KycContract.sol");
require('dotenv').config({path: '../.env'});

// module.exports = async function(deployer) {
//   let addr = await web3.eth.getAccounts();
//   await deployer.deploy(EVAToken, process.env.INITIAL_TOKENS);
//   await deployer.deploy(KycContract);
//   await deployer.deploy(EVATokenSales, 100, addr[0], EVAToken.address, KycContract.address);

//   let tokenInstance = await EVAToken.deployed();
//   await tokenInstance.transfer(EVATokenSales.address, process.env.INITIAL_TOKENS);
// };

module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(EVAToken);
  await deployer.deploy(KycContract);
  await deployer.deploy(EVATokenSales,
    1,                    // rate, still in TKNbits
    addr[0],           // send Ether to the deployer
    EVAToken.address,     // the token
    KycContract.address   // whitelist
  );

  // transfer the minter role from this contract (the default)
  // to the crowdsale, so it can mint tokens
  let tokenInstance = await EVAToken.deployed();
  tokenInstance.addMinter(EVATokenSales.address);
  tokenInstance.renounceMinter();
};