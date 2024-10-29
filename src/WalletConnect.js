// src/WalletConnect.js
import React, { useState } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ onConnect }) => {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setWalletAddress(account);
  
        const provider = new ethers.BrowserProvider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        
        console.log("Connected chainId:", chainId);  // Проверка текущего chainId
  
        // Преобразуем BigInt chainId в число и сравниваем
        if (Number(chainId) !== 1301) { 
          alert('Пожалуйста, переключитесь на сеть Unichain Sepolia.');
        } else {
          onConnect(provider, account);
        }
      } catch (error) {
        console.error('Ошибка подключения:', error);
      }
    } else {
      alert('MetaMask не обнаружен!');
    }
  };
  

  return (
    <div>
      <button onClick={connectWallet}>
        {walletAddress ? `Подключен: ${walletAddress}` : 'Подключить кошелек'}
      </button>
    </div>
  );
};

export default WalletConnect;
