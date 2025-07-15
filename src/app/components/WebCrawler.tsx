"use client";

import React, { useState, useEffect } from "react";

type Timeout = ReturnType<typeof setTimeout>;

export default function WebCrawler() {
  const [crawling, setCrawling] = useState(false);
  const [coinsFound, setCoinsFound] = useState(0);
  const [lastScanned, setLastScanned] = useState<Date | null>(null);

  // Simulate automatic crawling every 30 seconds
  useEffect(() => {
    let interval: Timeout;
    if (crawling) {
      interval = setInterval(() => {
        executeCrawl();
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [crawling]);

  const executeCrawl = async () => {
    try {
      const response = await fetch("/api/execute-crawler", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        setCoinsFound((prev) => prev + data.coinsFound);
        setLastScanned(new Date());
      }
    } catch (error) {
      console.error("Crawler execution failed:", error);
    }
  };

  const startCrawling = () => {
    setCrawling(true);
    executeCrawl();
  };

  const stopCrawling = () => {
    setCrawling(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Web Crawler</h2>
      <p className="text-center mb-2">
        Coins Found: <span className="font-mono">{coinsFound.toFixed(8)}</span> BTC
      </p>
      <p className="text-center mb-4">
        Last Scanned:{" "}
        {lastScanned ? lastScanned.toLocaleTimeString() : "Never"}
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={startCrawling}
          disabled={crawling}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          Start Crawler
        </button>
        <button
          onClick={stopCrawling}
          disabled={!crawling}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          Stop Crawler
        </button>
        <button
          onClick={executeCrawl}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Manual Crawl
        </button>
      </div>
    </div>
  );
}
