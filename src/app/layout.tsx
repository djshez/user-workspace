import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Bitcoin Miner - Marty",
  description: "Simulated Bitcoin mining app with matrix/blockchain theme",
  author: "marty",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black text-green-400">
      <head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
          `}
        </style>
      </head>
      <body
        className={`${inter.variable} font-mono min-h-screen bg-black text-green-400`}
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        {children}
      </body>
    </html>
  );
}
