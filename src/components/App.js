import React, { Component } from 'react';
import Navbar from "./Navbar"
import './App.css';
import Web3 from 'web3'
import Main from './Main'
import Meme from '../abis/Meme.json'
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
        await this.loadMeme();
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
        const networkData = Meme.networks[networkId];
        if(networkData) {
            const meme = window.web3.eth.Contract(Meme.abi, networkData.address);
            this.setState({meme});
        } else {
            alert("Cannot load contract (change network mayby)")
        }
    }
    async loadMeme() {
        const memePath = await this.state.meme.methods.memePath().call();
        this.setState({img: "https://ipfs.infura.io/ipfs/"+memePath})
    }
    async addMeme(meme) {
        await this.state.meme.methods.setMeme(meme).send({from: this.state.account}, async (e) => {
        await this.checkBlockNumber();
        })
    }
    async checkBlockNumber() {
       const sleep = (milliseconds) => {
           return new Promise(resolve => setTimeout(resolve, milliseconds))
       };
       const blockNumber = await window.web3.eth.getBlockNumber()
       let blockNumberNew = await window.web3.eth.getBlockNumber()
       while(blockNumber === blockNumberNew) {
           blockNumberNew = await window.web3.eth.getBlockNumber()
           await sleep(100);
       }
       await this.loadAccount();
       await this.loadMeme();
       this.setState({loading: false})

   }
    constructor(props) {
        super(props);
        this.state = {
            account: null,
            loading: false
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
        this.setState({loading: true})
        e.preventDefault();
        ipfs.add(this.state.buffer, (error, result) => {
            console.log(result[0].path)
            this.addMeme(result[0].hash)
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
      {this.state.loading
      ? <h1 className="display 2 text-center text-white">Loading ..</h1>
      : <Main img={this.state.img} captureFile={this.captureFile.bind(this)} onSubmit={this.onSubmit.bind(this)}/>}

      </div>
    );
  }
}

export default App;
