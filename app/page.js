"use client";

import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract } from 'ethers';

// Параметры сети и контракта
const contractAddress = "0x7ef52cF1f0D9EC7Fe5190d9f7CA976A633E0c0A7"; // Укажите здесь фактический адрес контракта
const requiredChainId = "0x515"; // ChainID UniChain Sepolia в hex-формате
const requiredChainIdDecimal = 1301; // ChainID UniChain Sepolia в десятичном формате

// ABI контракта, содержащий нужные функции
const abi = [
  "function checkIn() public",
  "function getLastCheckIn(address) public view returns (uint256)"
];

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [networkError, setNetworkError] = useState(null);

  // Подключение к кошельку
  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const prov = new BrowserProvider(window.ethereum);
        await prov.send("eth_requestAccounts", []);

        // Проверка текущей сети
        const network = await prov.getNetwork();
        const currentChainId = Number(network.chainId); // Преобразуем в обычное число

        console.log("Current chain ID:", currentChainId); // Для отладки
        console.log("Expected chain ID (Hex):", parseInt(requiredChainId, 16));
        console.log("Expected chain ID (Decimal):", requiredChainIdDecimal);

        // Проверка chainId как в hex, так и в десятичном формате
        if (
          currentChainId !== parseInt(requiredChainId, 16) &&
          currentChainId !== requiredChainIdDecimal
        ) {
          setNetworkError("Please switch to the UniChain Sepolia network.");
          return;
        }

        const sign = await prov.getSigner();
        setProvider(prov);
        setSigner(sign);
        setAccount(await sign.getAddress());
        setNetworkError(null);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        alert("Failed to connect to wallet. Check wallet permissions and network.");
      }
    } else {
      alert("Ethereum wallet not found! Please install MetaMask, OKX Wallet, or Rabby Wallet.");
    }
  };

  // Получение последнего чекина пользователя
  const fetchLastCheckIn = useCallback(async () => {
    if (provider && account) {
      try {
        // Используем контракт без разрешения ENS
        const contract = new Contract(contractAddress, abi, signer); // Используем signer вместо provider
        
        // Обращение к методу контракта
        const lastCheckInTimestamp = await contract.getLastCheckIn(account);
        setLastCheckIn(new Date(Number(lastCheckInTimestamp) * 1000));
      } catch (error) {
        console.error("Error fetching last check-in:", error);
        // Проверяем ошибку на предмет использования ENS
        if (error.code === "UNSUPPORTED_OPERATION") {
          setNetworkError("This network does not support ENS. Please switch to a supported network.");
        } else {
          setNetworkError("Error fetching data from the contract.");
        }
      }
    }
  }, [provider, account, signer]);

  // Выполнение чекина
  const handleCheckIn = async () => {
    if (!signer) return alert("Please connect your wallet first.");
    setIsCheckingIn(true);
    try {
      const contract = new Contract(contractAddress, abi, signer);
      const tx = await contract.checkIn();
      await tx.wait();
      fetchLastCheckIn();
    } catch (error) {
      console.error("Error during check-in:", error);
      alert("Error during check-in. Make sure to check in only once a day.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Вызываем fetchLastCheckIn при изменении account
  useEffect(() => {
    if (account) {
      fetchLastCheckIn();
    }
  }, [account, fetchLastCheckIn]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Daily Check-In</h1>
      {networkError ? (
        <p style={{ color: "red" }}>{networkError}</p>
      ) : (
        !account ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div>
            <p>Connected account: {account}</p>
            <p>
              Last Check-In: {lastCheckIn ? lastCheckIn.toLocaleString() : 'No check-in yet.'}
            </p>
            <button onClick={handleCheckIn} disabled={isCheckingIn}>
              {isCheckingIn ? 'Checking In...' : 'Check In'}
            </button>
          </div>
        )
      )}
    </div>
  );
}
