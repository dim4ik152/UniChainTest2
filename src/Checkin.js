// src/Checkin.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI } from './contract';
import './App.css'; // Убедитесь, что App.css импортирован

const Checkin = ({ provider, walletAddress }) => {
  const [error, setError] = useState(null);

  const handleCheckin = async () => {
    setError(null);

    if (!provider) {
      setError('Пожалуйста, подключите кошелек.');
      return;
    }

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.checkIn({ value: ethers.parseUnits("0.01", "ether") });
      await tx.wait();
      alert('Check-in успешно выполнен!');
    } catch (error) {
      console.error('Ошибка Check-in:', error);
      if (error.code === 'INSUFFICIENT_FUNDS') {
        setError('Недостаточно средств для выполнения транзакции. Пожалуйста, пополните баланс.');
      } else {
        setError('Произошла ошибка при выполнении Check-in. Попробуйте еще раз.');
      }
    }
  };

  return (
    <div className="App-header"> {/* Обернуть в App-header для применения стилей */}
      <button className="checkin-button" onClick={handleCheckin}>Сделать Check-in</button>
      {error && <div className="error-message">{error}</div>} {/* Сообщение об ошибке под кнопкой */}
    </div>
  );
};

export default Checkin;
