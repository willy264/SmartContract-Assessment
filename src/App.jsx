import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from './abiAss.json'; 

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [retrievedMessage, setRetrievedMessage] = useState('');
  const contractAddress = '0x237DBf83a492c71D27BFc018b7Bb53F07c2643d4';

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function setUserBalance() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const myContract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const tx = await myContract.withdraw(userInput);
        const receipt = await tx.wait();
        console.log('Transaction successful', receipt);
      } catch (error) {
        console.error('Failed Transaction Error:', error);
        if (error.code === 'CALL_EXCEPTION') {
          console.error('Revert reason:', error.reason);
        }
      }
    }
  }

  async function getUserBalance() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const myContract = new ethers.Contract(contractAddress, abi, provider);

      try {
        const tx = await myContract.getBalance();
        setRetrievedMessage(tx);
        console.log('retrieval successful', tx);
      } catch (err) {
        console.log('retrieval Failed', err);
      }
    }
  }

  return (
    <div>
      <input
        type="number"
        placeholder='Set your balance'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button onClick={setUserBalance}>Set Balance</button>

      {/* <input
        type="number"
        placeholder='Set your balance'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button onClick={getUserBalance}>Get Balance</button> */}

      <div>
        Retrieved Message: {retrievedMessage}
      </div>
    </div>
  );
};

export default App;
