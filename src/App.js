// src/App.js
import React, { useState } from 'react';
import WalletConnect from './WalletConnect';
import Checkin from './Checkin';
import './App.css'; // Импортируйте CSS файл Tailwind

function App() {
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnect = (provider, address) => {
    setProvider(provider);
    setWalletAddress(address);
  };

  return (
    <div className="App bg-main-gradient"> {/* Примените фон */}
      <h1 className="header-style text-5xl font-bold my-6">Unichain Sepolia Check-in</h1> {/* Заголовок с стилем */}
      <WalletConnect onConnect={handleConnect} />
      {walletAddress && <Checkin provider={provider} walletAddress={walletAddress} />} {/* Кнопка Check-in */}
    </div>
  );
}

export default App;
