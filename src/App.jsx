import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import idl from './idl.json';

const network = clusterApiUrl('devnet');
const programID = new PublicKey('7yJma8WtwCPBkJLcJ3FgxG2Rz1vdM85nfjMS1ufZg97C'); // your deployed program
const opts = { preflightCommitment: 'processed' };

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [solInput, setSolInput] = useState('');
  const [message, setMessage] = useState('');
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

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts);
    return provider;
  };

  const buyPresaleTokens = async () => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    try {
      const state = web3.Keypair.generate();
      const solAmount = parseFloat(solInput) * web3.LAMPORTS_PER_SOL;

      const tx = await program.methods
        .buy(new web3.BN(solAmount))
        .accounts({
          state: state.publicKey,
          buyer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setMessage(`Transaction successful! Signature: ${tx}`);
    } catch (err) {
      console.error('Transaction failed', err);
      setMessage('Transaction failed. See console for details.');
    }
  };

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setWalletConnected(true);
      setWalletAddress(window.solana.publicKey?.toString() || null);
    }
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const solRes = await fetch('https://public-api.birdeye.so/public/price?address=So11111111111111111111111111111111111111112', {
          headers: { 'x-api-key': 'birdeye-public-api-key' }
        });
        const sol = await solRes.json();
        setSolPrice(sol.data.value);

        const peepsRes = await fetch('https://public-api.birdeye.so/public/price?address=8DFkuXQWU8SVtpVZfw914YTU2ePNchdk9au58gMJb3W2', {
          headers: { 'x-api-key': 'birdeye-public-api-key' }
        });
        const peeps = await peepsRes.json();
        setPeepsPrice(peeps.data.value);
      } catch (err) {
        console.error('Error fetching price:', err);
      }
    };

    fetchPrices();
  }, []);

  const convertedAmount = solPrice && peepsPrice && solInput
    ? ((solInput * solPrice) / peepsPrice).toFixed(0)
    : '';

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', padding: '1rem', background: '#fff7d6', minHeight: '100vh' }}>
      <link rel="icon" href="/chick-icon.png" />
      <h1 style={{ fontSize: '2.2rem' }}>$PEEPS Presale</h1>
      <h2 style={{ fontWeight: 'normal' }}>The Cutest Chick in Crypto 🐣💛</h2>

      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
        Token Address:<br />
        <span style={{ color: '#d14719' }}>8DFkuXQWU8SVtpVZfw914YTU2ePNchdk9au58gMJb3W2</span>
      </p>

      {!walletConnected ? (
        <button onClick={connectWallet} style={{ marginTop: '1rem', padding: '0.6rem 1.2rem' }}>Connect Wallet</button>
      ) : (
        <>
          <button onClick={disconnectWallet} style={{ marginTop: '1rem' }}>Disconnect</button>
          <p style={{ fontSize: '0.8rem' }}>
            Connected: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </p>
        </>
      )}

      <div style={{ background: '#fff0c4', padding: '1rem', borderRadius: '12px', margin: '1rem auto', maxWidth: '400px' }}>
        <h3>💱 Live Prices:</h3>
        <p>1 SOL = ${solPrice?.toFixed(2) || '...'} USD</p>
        <p>1 $PEEPS = ${peepsPrice?.toFixed(6) || '...'} USD</p>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="sol-input">Enter SOL Amount:</label><br />
          <input
            id="sol-input"
            type="number"
            value={solInput}
            onChange={(e) => setSolInput(e.target.value)}
            placeholder="Enter amount in SOL"
            style={{ padding: '0.5rem', width: '200px', borderRadius: '6px' }}
          />
        </div>

        <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>

        <button
          onClick={buyPresaleTokens}
          style={{
            marginTop: '1rem',
            padding: '0.6rem 1.2rem',
            background: '#ffd91a',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Buy $PEEPS
        </button>
      </div>

      <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
        {convertedAmount && `${solInput} SOL ≈ ${convertedAmount} $PEEPS`}
      </p>

      <div style={{ margin: '2rem auto', maxWidth: '700px' }}>
        <h3>$PEEPS DEX Chart</h3>
        <iframe
          src="https://birdeye.so/token/8DFkuXQWU8SVtpVZfw914YTU2ePNchdk9au58gMJb3W2?chain=solana"
          width="100%"
          height="360"
          style={{ border: 'none', borderRadius: '10px' }}
          title="PEEPS Chart"
          allowFullScreen
        ></iframe>
      </div>

      <footer style={{ marginTop: '3rem', fontSize: '0.85rem', color: '#333', paddingTop: '2rem', borderTop: '1px solid #ccc' }}>
        &copy; 2025 Peeps ($PEEPS) ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default App;
