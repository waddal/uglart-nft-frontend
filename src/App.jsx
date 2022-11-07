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
      <div className="container">
        <div className="header-container">
          <h1>uglart.</h1>
          <p className="sub-text">Each art. Each ugly. Mint yours today.</p>
          {renderNotConnectedContainer()}
        </div>
      </div>
    </div>
  );
}

export default App;
