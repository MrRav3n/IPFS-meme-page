import React, { Component } from 'react';
import Navbar from "./Navbar"
import './App.css';
import Web3 from 'web3'
import Main from './Main'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadAccount();
        await this.loadContract();
        window.ethereum.on('accountsChanged', async (accounts)  => {
          await this.loadAccount();
        })
    }
    async loadWeb3() {

        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }
    async loadAccount() {
        const account = await window.web3.eth.getAccounts();
        this.setState({account: account[0]});
    }
    async loadContract() {
        const networkId = await window.web3.eth.net.getId();
    }

    constructor(props) {
        super(props);
        this.state = {
            account: null,
        }
    }
    captureFile = (e) => {
         e.preventDefault();
         const file = e.target.files[0]
         const reader = new window.FileReader()
         reader.readAsArrayBuffer(file)
         reader.onloadend = () => {
             this.setState({buffer: Buffer(reader.result)})

         }
         console.log()
    }
    onSubmit =(e) => {
        e.preventDefault();
        ipfs.add(this.state.buffer, (error, result) => {
            this.setState({img: "https://ipfs.infura.io/ipfs/"+result[0].hash})
            if(error) {
                console.error(error)
                return
            }
        })
    }

  render() {
    return (
      <div>
      <Navbar account={this.state.account} />
      <Main img={this.state.img} captureFile={this.captureFile.bind(this)} onSubmit={this.onSubmit.bind(this)}/>
      </div>
    );
  }
}

export default App;
