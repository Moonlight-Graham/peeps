import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, SystemProgram, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import idl from './idl.json';

const network = clusterApiUrl('devnet');
const programID = new PublicKey('7yJma8WtwCPBkJLcJ3FgxG2Rz1vdM85nfjMS1ufZg97C');
const opts = { preflightCommitment: 'processed' };

const App = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [solInput, setSolInput] = useState('');
  const [solPrice, setSolPrice] = useState(null);
  const [peepsPrice, setPeepsPrice] = useState(null);
  const [message, setMessage] = useState('');
  const [solRaised, setSolRaised] = useState(0);
  const [peepsBalance, setPeepsBalance] = useState('');

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

      const tx = await program.methods.buy(new web3.BN(solAmount)).accounts({
        state: state.publicKey,
        buyer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }).rpc();

      setMessage(`Transaction successful! Signature: ${tx}`);
    } catch (err) {
      console.error('Transaction failed', err);
      setMessage('Transaction failed. See console for details.');
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

  const fetchVaultBalance = async () => {
    try {
      const connection = new Connection(clusterApiUrl('devnet'));
      const vaultAddress = new PublicKey('8TsbiLU8QxWJwvAzLPz7rJsm38EfqkNcsxnhqDXVreKT');
      const balance = await connection.getBalance(vaultAddress);
      setSolRaised(balance / web3.LAMPORTS_PER_SOL);
    } catch (err) {
      console.error('Error fetching vault balance', err);
    }
  };

  const fetchPeepsBalance = async () => {
    try {
      const connection = new Connection(clusterApiUrl('devnet'));
      const TOKEN_ACCOUNT = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        {
          mint: new PublicKey('8DFxuKQWU8SVtpVZfw914YTU2ePNchdk9au58gMJb3W2'),
        }
      );

      const balance = TOKEN_ACCOUNT.value[0]?.account.data.parsed.info.tokenAmount.uiAmountString || '0';
      setPeepsBalance(balance);
    } catch (err) {
      console.error('Error fetching Peeps token balance', err);
    }
  };

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setWalletConnected(true);
      setWalletAddress(window.solana.publicKey?.toString() || null);
    }
    fetchPrices();
    fetchVaultBalance();
  }, []);

  useEffect(() => {
    if (walletConnected && walletAddress) {
      fetchPeepsBalance();
    }
  }, [walletConnected, walletAddress]);

  const convertedAmount = solPrice && peepsPrice && solInput
    ? ((solInput * solPrice + 500000 * peepsPrice) / (1 * peepsPrice)).toFixed(0)
    : '';

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', padding: '1rem', background: '#fff7d6', minHeight: '100vh' }}>
      <p><strong>The Official Peeps on Solana ($PEEPS) dApp</strong></p>
      <img src="/chick-icon.png" alt="$PEEPS Chick Icon" style={{ width: '120px', borderRadius: '50%' }} />

      <h1>$PEEPS Presale</h1>

      <button onClick={walletConnected ? disconnectWallet : connectWallet} style={{
        padding: '0.6rem 1.2rem',
        background: '#389AD7',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#ECFDFE',
        cursor: 'pointer'
      }}>
        {walletConnected ? 'Disconnect Wallet' : 'Connect Phantom Wallet'}
      </button>

      {walletAddress && (
        <p style={{ fontSize: '0.8rem' }}>
          Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}<br />
          Balance: {peepsBalance} $PEEPS
        </p>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Buy $PEEPS Tokens on Presale</h3>
        <input
          type="number"
          value={solInput}
          onChange={(e) => setSolInput(e.target.value)}
          placeholder="Enter amount in SOL"
          style={{ padding: '0.5rem', width: '200px', borderRadius: '6px' }}
        />
        <br /><br />
        <button
          onClick={buyPresaleTokens}
          style={{
            padding: '0.6rem 1.2rem',
            background: '#ffd91a',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '15px',
            borderColor: '#f0823F',
            border: '2px'
          }}>
          Buy $PEEPS Presale
        </button>
        <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Live Prices</h3>
        <p>1 SOL = ${solPrice || '...'} USD</p>
        <p>1 $PEEPS = ${peepsPrice || '...'} USD</p>
        {convertedAmount && solInput && (
          <p>{solInput} SOL ≈ {convertedAmount} $PEEPS @ $1 USD</p>
        )}
      </div>

      <div style={{ marginTop: '2rem', background: '#fff0b3', padding: '1rem', borderRadius: '12px', maxWidth: '400px', marginInline: 'auto' }}>
        <h3>Presale Progress</h3>
        <p><strong>{solRaised.toFixed(2)}</strong> / 100 SOL Raised</p>
        <div style={{ background: '#eee', height: '10px', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min((solRaised / 100) * 100, 100)}%`,
            backgroundColor: '#ffd91a'
          }} />
        </div>
      </div>

      <footer style={{ marginTop: '3rem', fontSize: '0.85rem', color: '#333', paddingTop: '2rem', borderTop: '1px solid #ccc' }}>
        &copy; 2025 Peeps ($PEEPS) ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default App;
