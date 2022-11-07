import React from "react";
import "./App.css";

function App() {
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
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
      {renderNotConnectedContainer()}
    </div>
  );
}

export default App;
