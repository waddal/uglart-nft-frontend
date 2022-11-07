import React, { useEffect, useState } from "react";
import "./App.css";

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
        <button onClick={null} className="cta-button connect-wallet-button">
          Mint NFT
        </button>
      )}
    </div>
  );
}

export default App;
