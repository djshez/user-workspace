"use client";

import React, { useEffect, useState, useRef } from "react";

const MATRIX_CHARS = "01";
const MATRIX_FONT_SIZE = 14;
const MATRIX_SPEED = 50;

function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }

    const columns = Math.floor(width / MATRIX_FONT_SIZE);
    const drops = new Array(columns).fill(1);

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#0F0";
      ctx.font = `${MATRIX_FONT_SIZE}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = MATRIX_CHARS.charAt(
          Math.floor(Math.random() * MATRIX_CHARS.length)
        );
        ctx.fillText(text, i * MATRIX_FONT_SIZE, drops[i] * MATRIX_FONT_SIZE);

        if (drops[i] * MATRIX_FONT_SIZE > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, MATRIX_SPEED);

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
      style={{ backgroundColor: "black" }}
    />
  );
}

export default function Home() {
  const [bitcoin, setBitcoin] = useState(0);
  const [mining, setMining] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [usdRate, setUsdRate] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const [depositStatus, setDepositStatus] = useState("");
  const [minedTotal, setMinedTotal] = useState(0);
  const [depositTotal, setDepositTotal] = useState(0);
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null);
  const [miningRate, setMiningRate] = useState(0);

  // Simulate mining bitcoin
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mining) {
      setMiningStartTime(Date.now());
      interval = setInterval(() => {
        const mined = Math.random() * 0.0001;
        setBitcoin((prev) => prev + mined);
        setMinedTotal((prev) => prev + mined);
        setMiningRate(mined);
      }, 1000);
    } else {
      setMiningStartTime(null);
      setMiningRate(0);
    }
    return () => clearInterval(interval);
  }, [mining]);

  // Fetch bitcoin to USD rate from CoinGecko API
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const data = await res.json();
        setUsdRate(data.bitcoin.usd);
      } catch (error) {
        console.error("Failed to fetch BTC price", error);
      }
    }
    fetchRate();
    const interval = setInterval(fetchRate, 60000); // update every 60s
    return () => clearInterval(interval);
  }, []);

  // Update USD value when bitcoin or rate changes
  useEffect(() => {
    setUsdValue(bitcoin * usdRate);
  }, [bitcoin, usdRate]);

  // Handle deposit input change
  function handleDepositChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDepositAmount(e.target.value);
  }

  // Simulate deposit to wallet
  function handleDeposit() {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setDepositStatus("Invalid deposit amount");
      return;
    }
    setBitcoin((prev) => prev + amount);
    setDepositTotal((prev) => prev + amount);
    setDepositStatus(`Deposited ${amount} BTC to wallet`);
    setDepositAmount("");
  }

  // Simulate Cash App deposit by opening Cash App URL with cashtag
  function handleCashAppDeposit() {
    const url = "https://cash.app/$marty6987";
    window.open(url, "_blank");
  }

  // Calculate mining elapsed time
  function getMiningElapsedTime() {
    if (!miningStartTime) return 0;
    return Math.floor((Date.now() - miningStartTime) / 1000);
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-green-400 font-mono z-10 p-4">
      <MatrixBackground />
      <h1 className="text-4xl mb-6">Bitcoin Miner Simulator</h1>
      <div className="mb-4">
        <button
          onClick={() => setMining(!mining)}
          className="bg-green-700 hover:bg-green-900 px-6 py-3 rounded-md transition"
        >
          {mining ? "Stop Mining" : "Start Mining"}
        </button>
      </div>
      <div className="mb-4 text-xl">
        <div>
          <strong>Wallet Balance:</strong> {bitcoin.toFixed(8)} BTC (~$
          {usdValue.toFixed(2)} USD)
        </div>
        <div>
          <strong>Total Mined:</strong> {minedTotal.toFixed(8)} BTC
        </div>
        <div>
          <strong>Total Deposited:</strong> {depositTotal.toFixed(8)} BTC
        </div>
        <div>
          <strong>Mining Rate:</strong> {miningRate.toFixed(8)} BTC / sec
        </div>
        <div>
          <strong>Mining Elapsed Time:</strong> {getMiningElapsedTime()} sec
        </div>
      </div>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Deposit BTC"
          value={depositAmount}
          onChange={handleDepositChange}
          className="text-black px-2 py-1 rounded"
          min="0"
          step="0.00000001"
        />
        <button
          onClick={handleDeposit}
          className="ml-2 bg-green-700 hover:bg-green-900 px-4 py-1 rounded"
        >
          Deposit
        </button>
      </div>
      <div className="mb-4">
        <button
          onClick={handleCashAppDeposit}
          className="bg-green-700 hover:bg-green-900 px-6 py-3 rounded-md transition"
        >
          Deposit to Cash App $marty6987
        </button>
      </div>
      {depositStatus && (
        <div className="mb-4 text-yellow-300">{depositStatus}</div>
      )}
      <div className="mt-auto text-sm opacity-70">Author: marty</div>
    </main>
  );
}
