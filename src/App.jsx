import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

import "./App.css";
import UglartNFT from './utils/UglartNFT.json'

function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  // Connecting MetaMask
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          UglartNFT.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeUglartNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h1>uglart.</h1>
        <p className="sub-text">Its ugly. Its art. Mint yours today.</p>
      </div>
      <div className="card-container">
        <div className="card">
          <img src="#" alt="nft" />
        </div>
        <div className="card">
          <img src="#" alt="nft" />
        </div>
        <div className="card">
          <img src="#" alt="nft" />
        </div>
      </div>
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
          Mint NFT
        </button>
      )}
    </div>
  );
}

export default App;
