import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './abiAss.json';
import './App.css';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const contractAddress = '0x237DBf83a492c71D27BFc018b7Bb53F07c2643d4';

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  async function checkIfWalletIsConnected() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setConnected(true);
          await getUserBalance();
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }

  async function connectWallet() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setConnected(true);
      await getUserBalance();
    } catch (error) {
      setError('Failed to connect wallet: ' + error.message);
    }
  }

  async function withdraw() {
    if (!userInput || parseFloat(userInput) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setError('');

    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const myContract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await myContract.withdraw(ethers.parseEther(userInput));
        await tx.wait();
        
        setUserInput('');
        await getUserBalance(); // Update balance after withdrawal
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
      setError(error.reason || 'Transaction failed. Please try again.');
    } finally {
    }
  }

  async function getUserBalance() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const myContract = new ethers.Contract(contractAddress, abi, provider);

        const balanceWei = await myContract.getBalance();
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(balanceEth);
      }
    } catch (error) {
      console.error('Failed to get balance:', error);
      setError('Failed to fetch balance');
    }
  }

  return (
    <div className="min-h-screen gradient-bg py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="glass-container relative px-4 py-10 shadow-xl sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              ETH Wallet Manager
            </h1>
            
            <div className="space-y-6">
              {!connected ? (
                <div className="text-center">
                  <p className="mb-4 text-gray-600">
                    Connect your wallet to get started
                  </p>
                  <button
                    onClick={connectWallet}
                    className="button-primary text-white px-6 py-3 rounded-lg font-semibold text-lg w-full"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <>
                  <div className="balance-card">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                      Current Balance
                    </h2>
                    <p className="text-3xl font-bold text-gray-900">
                      {balance} ETH
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Withdrawal Amount
                      </label>
                      <input
                        type="number"
                        placeholder="Amount to withdraw (ETH)"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="input-style w-full px-4 py-3 rounded-lg border border-gray-300"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={withdraw}
                        className="button-secondary text-white px-6 py-3 rounded-lg font-semibold flex-1"
                      >
                        Withdraw
                      </button>

                      <button
                        onClick={getUserBalance}
                        className="button-primary text-white px-6 py-3 rounded-lg font-semibold"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;