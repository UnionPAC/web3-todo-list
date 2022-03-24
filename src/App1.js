import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState('');


  // Check if user is connected
  const checkIfWalletConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Please install MetaMask!");
        return;
      } else {
        console.log("Got the Ethereum Object ✅", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account ✅", account);
        setCurrentAccount(account);
      } else {
        console.log("No Authorized Account");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Connect Wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask!");
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

  const loggedOutUI = () => (
    <button
      style={{ marginTop: "30px" }}
      className="connect-btn"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );

  const loggedInUI = () => <p>Logged In</p>;

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <div className="App">
      <h1>To-do List</h1>
      {currentAccount ? loggedInUI() : loggedOutUI()}
    </div>
  );
};

export default App;
