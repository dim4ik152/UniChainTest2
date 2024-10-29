// src/App.js
import React, { useState, useEffect } from 'react';
import WalletConnect from './WalletConnect';
import Checkin from './Checkin';
import './App.css'; // Импортируйте CSS файл Tailwind

function App() {
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  // Загружаем адрес кошелька из localStorage при загрузке приложения
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setWalletAddress(savedAddress);
      // Восстановите провайдер, если нужно, в зависимости от вашей логики
      // Возможно, вам потребуется также сохранить и восстановить provider
    }
  }, []);

  const handleConnect = (provider, address) => {
    setProvider(provider);
    setWalletAddress(address);
    // Сохраняем адрес в localStorage
    localStorage.setItem('walletAddress', address);
  };

  const handleDisconnect = () => {
    setProvider(null);
    setWalletAddress('');
    // Удаляем адрес из localStorage при отключении
    localStorage.removeItem('walletAddress');
  };

  return (
    <div className="App bg-main-gradient"> {/* Примените фон */}
      <h1 className="header-style text-5xl font-bold my-6">Unichain Sepolia Check-in</h1> {/* Заголовок с стилем */}
      <WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />
      {walletAddress && <Checkin provider={provider} walletAddress={walletAddress} />} {/* Кнопка Check-in */}
    </div>
  );
}

export default App;
