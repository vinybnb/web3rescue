import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ApprovalList from './components/ApprovalList.jsx';
import { fetchTokenApprovals } from './services/approvalService.js';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');

  // Search mode
  const [searchMode, setSearchMode] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');

  // Get API key from environment or user input
  useEffect(() => {
    const envApiKey = import.meta.env.VITE_BSCSCAN_API_KEY;
    if (envApiKey && envApiKey !== 'your_api_key_here') {
      setApiKey(envApiKey);
    }
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed. Please install MetaMask extension to use this app.');
        return;
      }

      // Check if it's actually MetaMask (not another wallet)
      if (!window.ethereum.isMetaMask) {
        setError('Please use MetaMask wallet. Other wallets are not supported yet.');
        return;
      }

      console.log('Requesting accounts...');

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      console.log('Accounts received:', accounts);

      if (!accounts || accounts.length === 0) {
        setError('No accounts found. Please unlock MetaMask and try again.');
        return;
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      console.log('Connected to network:', network.chainId);

      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setProvider(provider);
      setSigner(signer);
      setError(null);

      console.log('Wallet connected successfully');
    } catch (err) {
      console.error('Connection error:', err);

      // Handle specific error cases
      if (err.code === 4001) {
        setError('Connection rejected. Please approve the connection in MetaMask.');
      } else if (err.code === -32002) {
        setError('Connection request already pending. Please check MetaMask.');
      } else {
        setError(`Failed to connect: ${err.message || 'Unknown error'}`);
      }
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setApprovals([]);
  };

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        setApprovals([]);
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(parseInt(chainId, 16));
      setApprovals([]);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account]);

  // Fetch approvals when wallet is connected
  const handleFetchApprovals = async () => {
    const targetAddress = searchMode ? searchAddress : account;

    if (!targetAddress) {
      setError(searchMode ? 'Please enter a wallet address' : 'Please connect wallet');
      return;
    }

    if (!apiKey) {
      setError('Please provide BscScan API key');
      return;
    }

    // Validate address format
    if (!ethers.isAddress(targetAddress)) {
      setError('Invalid wallet address format');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bscProvider = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org');
      const fetchedApprovals = await fetchTokenApprovals(targetAddress, apiKey, bscProvider);
      setApprovals(fetchedApprovals);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when wallet connects (if API key is set) - only in non-search mode
  useEffect(() => {
    if (!searchMode && account && apiKey && chainId === 56) {
      handleFetchApprovals();
    }
  }, [account, apiKey, chainId, searchMode]);

  const handleRevoked = (revokedApproval) => {
    // Remove the revoked approval from the list
    setApprovals(prev =>
      prev.filter(a =>
        !(a.tokenAddress === revokedApproval.tokenAddress &&
          a.spender === revokedApproval.spender)
      )
    );
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="app">
      <div className="app-background"></div>

      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🛡️</div>
            <div>
              <h1>BSC Token Approval Manager</h1>
              <p className="tagline">Secure your wallet by managing token approvals</p>
            </div>
          </div>

          <div className="connect-section">
            {!account ? (
              <button onClick={connectWallet} className="connect-button">
                Connect MetaMask
              </button>
            ) : (
              <div className="wallet-info">
                <div className="wallet-address">{formatAddress(account)}</div>
                <button onClick={disconnectWallet} className="disconnect-button">
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {!account && !searchMode ? (
          <div className="welcome-section">
            <div className="welcome-icon">🔐</div>
            <h2>Welcome to BSC Token Approval Manager</h2>
            <p>Connect your MetaMask wallet or search any address to view token approvals on BNB Smart Chain</p>

            <button onClick={() => setSearchMode(true)} className="search-mode-button">
              🔍 Search Any Wallet Address
            </button>

            <div className="features">
              <div className="feature">
                <span className="feature-icon">👁️</span>
                <h3>View Approvals</h3>
                <p>See all active token approvals</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🚫</span>
                <h3>Revoke Access</h3>
                <p>Remove unwanted approvals instantly</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <h3>Stay Safe</h3>
                <p>Protect your assets from exploits</p>
              </div>
            </div>
          </div>
        ) : chainId && chainId !== 56 && !searchMode ? (
          <div className="error-section">
            <div className="error-icon">⚠️</div>
            <h2>Wrong Network</h2>
            <p>Please switch to BNB Smart Chain (BSC) network in MetaMask</p>
            <p className="network-info">Current Chain ID: {chainId}</p>
          </div>
        ) : (
          <>
            {/* Search Mode UI */}
            {searchMode && (
              <div className="search-section">
                <div className="search-header">
                  <h2>🔍 Search Wallet Approvals</h2>
                  <button onClick={() => { setSearchMode(false); setSearchAddress(''); setApprovals([]); }} className="back-button">
                    ← Back to {account ? 'My Wallet' : 'Home'}
                  </button>
                </div>
                <p>Enter any BSC wallet address to view its token approvals</p>
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Enter wallet address (0x...)"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleFetchApprovals();
                      }
                    }}
                    className="search-address-input"
                  />
                  <button
                    onClick={handleFetchApprovals}
                    className="search-button"
                    disabled={!searchAddress || loading}
                  >
                    {loading ? 'Searching...' : '🔍 Search'}
                  </button>
                </div>
              </div>
            )}

            {!apiKey || apiKey === 'your_api_key_here' ? (
              <div className="api-key-section">
                <h2>BscScan API Key Required</h2>
                <p>Enter your BscScan API key to fetch token approvals</p>
                <div className="api-key-input-group">
                  <input
                    type="text"
                    placeholder="Enter BscScan API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="api-key-input"
                  />
                  <button
                    onClick={handleFetchApprovals}
                    className="fetch-button"
                    disabled={!apiKey || loading}
                  >
                    {loading ? 'Fetching...' : 'Fetch Approvals'}
                  </button>
                </div>
                <p className="api-key-help">
                  Get a free API key at{' '}
                  <a href="https://bscscan.com/apis" target="_blank" rel="noopener noreferrer">
                    bscscan.com/apis
                  </a>
                </p>
              </div>
            ) : loading ? (
              <div className="loading-section">
                <div className="loading-spinner"></div>
                <h2>Fetching Approvals...</h2>
                <p>This may take a moment</p>
              </div>
            ) : error ? (
              <div className="error-section">
                <div className="error-icon">❌</div>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={handleFetchApprovals} className="retry-button">
                  Try Again
                </button>
              </div>
            ) : (
              <ApprovalList
                approvals={approvals}
                signer={searchMode ? null : signer}
                onRevoked={handleRevoked}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built for security-conscious Web3 users •{' '}
          <a href="https://bscscan.com" target="_blank" rel="noopener noreferrer">
            Powered by BscScan
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
