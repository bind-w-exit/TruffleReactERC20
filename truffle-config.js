const path = require("path");
require('dotenv').config({path: './.env'});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    // develop: {
    //   port: 8545,
    //   network_id: "1337",
    // },
    development: {
      port: 8545,
      network_id: "*",
      host: "127.0.0.1"
    },
    ganache_local: {
      provider: function() {
        return new HDWalletProvider("YOUR MNEMONIC", "http://127.0.0.1:8545", MetaMaskAccountIndex )
      },
      network_id: "*"
    },
    ropsten_infura: {
      provider: function() {
        return new HDWalletProvider("YOUR MNEMONIC", "https://ropsten.infura.io/v3/310c482e7acf4a55be9ee5b9036390d7", MetaMaskAccountIndex )
      },
      network_id: 3
    }
  },
  
  compilers:
  {
    solc: {
      version: "0.6.2"
    }
  }
};
