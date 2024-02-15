// hooks/useWeb3.jsx
import { useState, useEffect } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

const useWeb3 = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState('');
    const [chainId, setChainId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [currency, setCurrency] = useState('');
    const allowedChainIds = {
        '1': 'ETH', // Ethereum Mainnet
        '56': 'BNB', // Binance Smart Chain
    };
    const updateCurrency = (chainId) => {
        if (!chainId) {
            console.error("Chain ID is null or undefined.");
            return; // Exit if chainId is not set
        }
        const currency = allowedChainIds[chainId];
        if (currency) {
            setCurrency(currency);
        } else {
            setErrorMessage('Chain ID not supported');
            setIsConnected(false); // Optionally disconnect if the chain is not supported
        }
    };
    // Convert Wei to Ether
    const toEther = (wei) => (wei / 10 ** 18).toString();

    const connectMetaMask = async () => {
        if (!window.ethereum) {
            console.error('MetaMask is not installed!');
            setErrorMessage('MetaMask is not installed!');
            return;
        }
    
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const accountAddress = accounts[0];
                setAddress(accountAddress);
                setIsConnected(true);
                
                const weiBalance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [accountAddress, 'latest']
                });
                setBalance((weiBalance / 10 ** 18).toString());
                
                const _chainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }), 16);
                console.log('Connecting to MetaMask...');
                if (!(_chainId.toString() in allowedChainIds)) {
                    setErrorMessage('Chain ID not supported');
                    setIsConnected(false);
                    return;
                }
    
                setChainId(_chainId);
                updateCurrency(_chainId.toString()); // Ensure this uses the local _chainId
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error.message || error);
            setErrorMessage('Failed to connect with MetaMask.');
        }
    };

    const connectWalletConnect = async () => {
        const wcProvider = new WalletConnectProvider({
            infuraId: "",
        });

        try {
            await wcProvider.enable();
            const provider = new ethers.providers.Web3Provider(wcProvider);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            const userBalance = await signer.getBalance();
            const network = await provider.getNetwork();

            const _chainId = network.chainId;
            if (!allowedChainIds.includes(_chainId)) {
                setErrorMessage('Chain ID not supported');
                setIsConnected(false); // Optionally disconnect
                return; // Stop further execution
            }

            setIsConnected(true);
            setAddress(userAddress);
            setBalance(ethers.utils.formatEther(userBalance));
            updateCurrency(_chainId.toString());
            setChainId(_chainId.toString());
        } catch (error) {
            console.error('Error connecting with WalletConnect:', error);
            setErrorMessage('Failed to connect with WalletConnect.');
        }
        
    };

    const logout = () => {
        // Resetting the state to its initial values
        setIsConnected(false);
        setAddress('');
        setBalance('');
        setChainId('');
    };


    // Listen for account changes
    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask.');
            } else if (accounts[0] !== address) {
                setAddress(accounts[0]);
                // Optionally, you can also fetch balance and chain ID here
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        // Cleanup subscription on component unmount
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [address]);

    return { isConnected, address, balance, chainId, currency, connectMetaMask, connectWalletConnect, errorMessage, logout };
};

export default useWeb3;
