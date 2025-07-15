"use client";

import React, { useState, useEffect, useRef } from "react";

type Timeout = ReturnType<typeof setTimeout> | null;

export default function MinerDashboard() {
  const [mining, setMining] = useState(false);
  const [coinsMined, setCoinsMined] = useState(0);
  const miningInterval = useRef<Timeout>(null);

  // Simulate mining by incrementing coins every second
  useEffect(() => {
    if (mining) {
      miningInterval.current = setInterval(() => {
        setCoinsMined((prev) => prev + Math.random() * 0.0001);
      }, 1000);
    } else {
      if (miningInterval.current) {
        clearInterval(miningInterval.current);
      }
    }
    return () => {
      if (miningInterval.current) {
        clearInterval(miningInterval.current);
      }
    };
  }, [mining]);

  // Start mining handler
  const startMining = async () => {
    setMining(true);
    // Call API to start miner (optional)
    try {
      await fetch("/api/start-miner", { method: "POST" });
    } catch (error) {
      console.error("Failed to start miner:", error);
    }
  };

  // Stop mining handler
  const stopMining = async () => {
    setMining(false);
    // Call API to stop miner (optional)
    try {
      await fetch("/api/stop-miner", { method: "POST" });
      // Save mined coins to local drive
      await fetch("/api/save-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coins: coinsMined }),
      });
    } catch (error) {
      console.error("Failed to stop miner or save coins:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Fiobit Bitcoin Miner</h2>
      <p className="text-center mb-4">
        Coins Mined: <span className="font-mono">{coinsMined.toFixed(8)}</span> BTC
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={startMining}
          disabled={mining}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          Start Mining
        </button>
        <button
          onClick={stopMining}
          disabled={!mining}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          Stop Mining
        </button>
      </div>
    </div>
  );
}
