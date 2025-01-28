import React, { useState } from 'react'
import abi from './abi.json'
import { ethers } from 'ethers'

const App = () => {

  const [userInput, setUserInput] = useState('');
  const [retrievedMessage, setRetrievedMessage] = useState('')
  const contractAddress = '0x32871De03345ECfba742e1BC163E66C2903F7640'

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function setUserMessage() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccounts()

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner() 
      const myContract = new ethers.Contract(contractAddress, abi, signer)  // CONTRACT INSTANCE:  using signer because it is a write function

      try {
        const tx = await myContract.setMessage(userInput)
        const receipt = tx.wait()
        console.log('transaction successful', receipt)

      } catch(err) {
        console.log('Failed Transaction', err)
      }
    }
  }

  console.log(userInput);
  
  async function getUserMessage() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccounts()

      const provider = new ethers.BrowserProvider(window.ethereum)
      const myContract = new ethers.Contract(contractAddress, abi, provider)

      try {
        const tx = await myContract.getMessage()
        setRetrievedMessage(tx)
        console.log('retrieval successful', tx)

      } catch(err) {
        console.log('retrieval Failed', err)
      }
    }
  }

  return (
    <div>
      <input 
        type="text" 
        placeholder='Set your message'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button onClick={setUserMessage}>Set message</button>
      <button onClick={getUserMessage}>Get message</button>
      <p >Retrieved message: {retrievedMessage}</p>

    </div>
  )
}

export default App


