"use client";

import React, { useState } from "react";

export default function CashAppWallet() {
  const [depositing, setDepositing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [message, setMessage] = useState("");

  const openModal = () => {
    setShowModal(true);
    setMessage("");
  };

  const closeModal = () => {
    setShowModal(false);
    setDepositAmount("");
    setMessage("");
  };

  const handleDeposit = async () => {
    setDepositing(true);
    setMessage("");
    try {
      const response = await fetch("/api/deposit-cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(depositAmount) }),
      });
      if (response.ok) {
        setMessage("Deposit successful!");
      } else {
        setMessage("Deposit failed. Please try again.");
      }
    } catch (error) {
      setMessage("Error during deposit.");
      console.error("Deposit error:", error);
    }
    setDepositing(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Cash App Wallet</h2>
      <div className="flex justify-center">
        <button
          onClick={openModal}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Deposit to Wallet
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 id="modal-title" className="text-xl font-semibold mb-4">
              Deposit to Cash App Wallet
            </h3>
            <input
              type="number"
              min="0"
              step="0.00000001"
              placeholder="Amount in BTC"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
                disabled={depositing}
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={depositing || !depositAmount || parseFloat(depositAmount) <= 0}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {depositing ? "Depositing..." : "Confirm Deposit"}
              </button>
            </div>
            {message && (
              <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
