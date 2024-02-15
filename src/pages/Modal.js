// components/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, connectMetaMask, connectWalletConnect }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Login Options</h2>
                <button
                    onClick={connectMetaMask}
                    className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition"
                >
                    Login with MetaMask
                </button>
                <button onClick={connectWalletConnect} className='px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition'>Connect with WalletConnect</button>
                <button onClick={onClose} className="mt-4 px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600 transition">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
