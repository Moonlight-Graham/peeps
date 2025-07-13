// Updated App.jsx with social icons for Twitter and Telegram

import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { FaTwitter, FaTelegramPlane } from 'react-icons/fa';

const tokenMint = new PublicKey('');
const connection = new Connection(clusterApiUrl('mainnet-beta'));

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [peepsBalance, setPeepsBalance] = useState('');
  const [solPrice, setSolPrice] = useState(null);
  const [peepsPrice, setPeepsPrice] = useState(null);

  const connectWallet = async () => {
    try {
      const resp = await window.solana.connect();
      setWalletConnected(true);
      setWalletAddress(resp.publicKey.toString());
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.solana.disconnect();
      setWalletConnected(false);
      setWalletAddress(null);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrices = async () => {
    try {
      const solRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const sol = await solRes.json();
      setSolPrice(sol.solana.usd);
      setPeepsPrice((1 / 500000).toFixed(9));
    } catch (err) {
      console.error('Error fetching prices', err);
    }
  };

  const fetchPeepsBalance = async () => {
    try {
      const TOKEN_ACCOUNT = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        { mint: tokenMint }
      );
      const balance = TOKEN_ACCOUNT.value[0]?.account.data.parsed.info.tokenAmount.uiAmountString || '0';
      setPeepsBalance(balance);
    } catch (err) {
      console.error('Error fetching $PEEPS balance', err);
    }
  };

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setWalletConnected(true);
      setWalletAddress(window.solana.publicKey?.toString() || null);
    }
    fetchPrices();
  }, []);

  useEffect(() => {
    if (walletConnected && walletAddress) {
      fetchPeepsBalance();
    }
  }, [walletConnected, walletAddress]);

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', padding: '1rem', background: '#fff7d6', minHeight: '100vh' }}>
      <p><strong>The Official $PEEPS Dashboard</strong></p>
      <img src="/chick-icon.png" alt="$PEEPS Chick Icon" style={{ width: '120px', borderRadius: '50%' }} />

      <h1>$PEEPS</h1>
      <h2 style={{ fontWeight: 'normal' }}>The Cutest Chick in Crypto</h2>
      <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
        $PEEPS is a fun and vibrant meme coin born to entertain, hatch new eggheads, and bring pure joy to Solana. From the coop to the moon, Peeps is on a mission to rule the meme chain.
      </p>

      <div style={{ marginTop: '1rem' }}>
        <a href="https://x.com/peepssolana" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px', fontSize: '1.8rem', color: '#1DA1F2' }}>
          <FaTwitter />
        </a>
      </div>

      <button
        onClick={walletConnected ? disconnectWallet : connectWallet}
        style={{
          padding: '0.6rem 1.2rem',
          background: '#38A9D7',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#FCFDFE',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        {walletConnected ? 'Disconnect Wallet' : 'Connect Phantom Wallet'}
      </button>

      {walletAddress && (
        <p style={{ fontSize: '0.8rem' }}>
          Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}<br />
          Balance: {peepsBalance} $PEEPS
        </p>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Live Prices</h3>
        <p>1 SOL = ${solPrice || '...'} USD</p>
      </div>

      <a
        href="https://"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          padding: '0.6rem 1.5rem',
          backgroundColor: '#facc15',
          color: '#000',
          fontWeight: 'bold',
          borderRadius: '8px',
          textDecoration: 'none'
        }}
      >
        Trade on Pump.fun
      </a>
<div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#fff7e6', borderRadius: '12px', maxWidth: '700px', marginInline: 'auto', textAlign: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
  <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>🡙 $PEEPS Merch Rewards Store</h2>
  <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#555' }}>
    Exclusive $PEEPS hats and t-shirts are on the way.
    <br />
    <strong>Coming soon at $100k market cap!</strong>
  </p>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
    <div style={{ width: '140px', textAlign: 'center' }}>
      <img src="/peeps-hat.jpg" alt="$PEEPS Hat" style={{ width: '100%', borderRadius: '8px' }} />
      <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#222' }}>$PEEPS Hat</p>
    </div>
    <div style={{ width: '140px', textAlign: 'center' }}>
      <img src="/peeps-shirt.jpg" alt="$PEEPS T-Shirt" style={{ width: '100%', borderRadius: '8px' }} />
      <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#222' }}>$PEEPS T-Shirt</p>
    </div>
  </div>
</div>
      <div style={{ marginTop: '2rem', maxWidth: '700px', marginInline: 'auto' }}>
        <h3>$PEEPS Live Chart</h3>
        <iframe
          src=
          width="100%"
          height="400"
          style={{ border: 'none', borderRadius: '12px' }}
          title="$PEEPS Chart"
          allowFullScreen
        />
      </div>

      <footer style={{ marginTop: '3rem', fontSize: '0.85rem', color: '#333', paddingTop: '2rem', borderTop: '1px solid #ccc' }}>
        &copy; 2025 Peeps ($PEEPS) ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default App;
