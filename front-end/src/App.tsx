import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import NotFound from './pages/OtherPage/NotFound';
import AppLayout from './layout/AppLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import Home from './pages/Dashboard/Home';
import LoginMetamask from './pages/LoginMetamask';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import WaitSignPage from './pages/WaitSignPage';
import CreatePage from './pages/CreatePage';
import HistoryHandOver from './pages/HistoryHandOver';

export default function App() {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [address, setAddress] = useState('');

  const setupProvider = async (provider: any) => {
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    setWeb3Provider(provider);
    setAddress(addr);
  };

  const connectWallet = async (requestAccess = false) => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        undefined
      );
      const method = requestAccess ? 'eth_requestAccounts' : 'eth_accounts';
      const accounts = await provider.send(method, []);

      if (accounts.length > 0) {
        await setupProvider(provider);
        localStorage.setItem('isWalletConnected', 'true');
      } else {
        localStorage.removeItem('isWalletConnected');
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem('isWalletConnected');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('isWalletConnected') === 'true') {
      connectWallet(false);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = async (accounts: any) => {
      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await setupProvider(provider);
      } else {
        setWeb3Provider(null);
        setAddress('');
        localStorage.removeItem('isWalletConnected');
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const disconnectWallet = () => {
    setWeb3Provider(null);
    setAddress('');
    localStorage.removeItem('isWalletConnected');
  };

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <AppLayout
                web3Provider={web3Provider}
                address={address}
                disconnectWallet={disconnectWallet}
              />
            }
          >
            <Route
              index
              path="/"
              element={address ? <Home /> : <Navigate to="/connect-metamask" />}
            />
            <Route
              path="create"
              element={
                address ? <CreatePage /> : <Navigate to="/connect-metamask" />
              }
            />
            <Route
              path="history"
              element={
                address ? (
                  <HistoryHandOver />
                ) : (
                  <Navigate to="/connect-metamask" />
                )
              }
            />
          </Route>
          <Route
            path="/connect-metamask"
            element={
              address ? (
                <Navigate to="/" />
              ) : (
                <LoginMetamask connectWallet={connectWallet} />
              )
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
