import React, { Component } from "react";
import EVAToken from "./contracts/EVAToken.json";
import EVATokenSale from "./contracts/EVATokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  state = { loaded: false, kycAddress: "0x123", tokenSaleAddress: "", userTokens: 0, totalSupply: 0 };

  componentDidMount = async () => {
    try {
        // Get network provider and web3 instance.
        this.web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        this.accounts = await this.web3.eth.getAccounts();

        
        this.networkId = await this.web3.eth.getChainId();      
        

        // Get the contract instance.
        this.evaToken = new this.web3.eth.Contract(
          EVAToken.abi,
          EVAToken.networks[this.networkId] && EVAToken.networks[this.networkId].address,
        );

        this.evaTokenSale = new this.web3.eth.Contract(
          EVATokenSale.abi,
          EVATokenSale.networks[this.networkId] && EVATokenSale.networks[this.networkId].address,
        );
        

        this.kycContract = new this.web3.eth.Contract(
          KycContract.abi,
          KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
        );




        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.listenToTokenTransfer();
        this.listenToTotalSuppleChanged();
        this.updateTotalSupply();
        this.setState({ loaded:true, tokenSaleAddress: this.evaTokenSale._address }, this.updateUserTokens);
        
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }


  handleKycSubmit = async () => {
    const {kycAddress} = this.state;
    console.log("sss");
    await this.kycContract.methods.setKycCompleted(kycAddress).send({from: this.accounts[0]});
    alert("Account "+kycAddress+" is now whitelisted");
  }

  handleBuyToken = async () => {
    await this.evaTokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: 1});
  }

  updateUserTokens = async() => {
    let userTokens = await this.evaToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens});
  }

  listenToTokenTransfer = async() => {
    this.evaToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  updateTotalSupply = async() => {
    let totalSupply = await this.evaToken.methods.totalSupply().call();
    this.setState({totalSupply: totalSupply});
  }

  listenToTotalSuppleChanged = async() => {
    this.evaToken.events.TotalSuppleChanged().on("data", this.updateTotalSupply);
  }


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Evangelion token</h1>
        <h2>Total supply: {this.state.totalSupply}</h2>

        <h2>Enable your account</h2>
        Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleKycSubmit}>Add Address to Whitelist</button>

        <h2>Buy Evangelion Tokens</h2>
        <p>Send Ether to this address: {this.state.tokenSaleAddress}</p>

        <p>You have: {this.state.userTokens}</p>
        <button type="button" onClick={this.handleBuyToken}>Buy more tokens</button>

      </div>
    );
  }
}

export default App;
