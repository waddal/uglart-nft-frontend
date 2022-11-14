import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./App.css";
import UglartNFT from "./utils/UglartNFT.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isMining, setIsMining] = useState(false);
  const [isMinted, setIsMinted] = useState(null);
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

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
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

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

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
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

        // This will essentially "capture" our event when our contract throws it.
        connectedContract.on("NewUglartNFTMinted", (from, tokenId) => {
          setIsMinted(tokenId.toNumber());
          console.log(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);

      const goerliChainId = "0x5";
      if (chainId !== goerliChainId) {
        alert("You are not connected to the Goerli Test Network!");
      }

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

        if (nftTxn) setIsMining(true);
        console.log("Mining...please wait.", isMining);

        let txnComplete = await nftTxn.wait();
        if (txnComplete) setIsMining(false);
        console.log("isMining: ", isMining);

        console.log("Mining complete!: ", txnComplete);
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

  // VIEWS
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintContainer = () => (
    <button
      onClick={askContractToMintNft}
      className="cta-button connect-wallet-button"
      disabled={isMining}
    >
      {isMining ? "Mining..." : "Mint NFT"}
    </button>
  );

  const renderLinkContainer = () => (
    <a onClick={() => setIsMinted(null)}
      className="link-container"
      href={`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${isMinted}`}
      target="_blank"
      alt="opensea nft link"
    >
      Congrats, you created something ugly.
    </a>
  );

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
      {isMinted && renderLinkContainer()}
      {currentAccount === ""
        ? renderNotConnectedContainer()
        : renderMintContainer()}
    </div>
  );
}

export default App;
