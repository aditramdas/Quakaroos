// Home.jsx
import React from 'react';
import useWeb3 from '../hooks/useWeb3';  // Adjust the import path as necessary
import Modal from './Modal'; // Adjust the import path as necessary

const Home = () => {
    const { isConnected, chainId, address, balance, currency,connectMetaMask, connectWalletConnect, errorMessage, logout } = useWeb3();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    return (
        <div className="p-4">
          <p className='text-black font-bold py-2 px-4 rounded'>{errorMessage && <p>{errorMessage}</p>}</p>
            {!isConnected ? (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
                >
                    Connect Wallet
                </button>
            ) : (
                <>
                    <div className='text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded my-5'>Address: {address}</div>
                    <div className='text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded my-5'>Balance: {balance} {currency}</div>
                    <div className='text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded my-5'>Chain ID: {chainId}</div>
                    <button
                        onClick={logout}
                        className="text-white bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded mt-4"
                    >
                        Logout
                    </button>
                </>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                connectMetaMask={() => { connectMetaMask(); setIsModalOpen(false); }}
                connectWalletConnect={connectWalletConnect}
            />
        </div>
    );
};

export default Home;
