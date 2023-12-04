import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import RegModal from '../Modal/RegModal.jsx';
import UnRegModal from '../Modal/UnRegModal.jsx';

const Admin = ({contract, account, gameBitBalance}) => {

    const [regAddress, setRegAddress] = useState('');
    const [unregAddress, setUnRegAddress] = useState('');
    const [showModal, setShowModal] = useState(false);

    const fromAddress = account[0];
    
    const [toAddress, setToAddress] = useState('');
    const [unRegAddress, setunRegAddress] = useState('');

    const register = async () => {
        if (!contract.gameBit) {
            console.log("gameBit is not available yet");
            return;
        }
        const { gameItem } = contract;

        try {
            const register = await gameItem.regMinter(toAddress);
            setRegAddress(toAddress)
            setShowModal(true);
            console.log("Registered:", toAddress);
        } catch (error) {
            console.error("Error registering address:", error);
        }
    };

    const unRegister = async () => {
        if (!contract.gameBit) {
            console.log("gameBit is not available yet");
            return;
        }
        const { gameItem } = contract;

        try {
            const unRegister = await gameItem.unregMinter(unRegAddress);
            setUnRegAddress(unRegAddress)
            setShowModal(true);
            console.log("Unregistered:", unRegAddress);
        } catch (error) {
            console.error("Error unregistering address:", error);
        }
    };
    
    const handleRegister = () => {
        register();
    };
    const handleUnregister = () => {
        unRegister();
    }; 
    
    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className="bg-blue-500 min-h-screen flex flex-col">
            <Navbar account={account} gameBitBalance={gameBitBalance} contract={contract}></Navbar>
            <div className="bg-black p-4 rounded-md shadow-md hover:shadow-lg mt-6 mr-6 mb-6 ml-6">
                <h1 className="text-xl font-bold text-center text-white">Admin</h1>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center">
                <div className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg mt-6 mx-auto mb-6 flex flex-col items-center">
                    <div className="mb-4">
                        <div className="flex flex-col mb-6">
                            <label htmlFor="input1" className="text-sm text-white mb-2">Register Address to Mint :</label>
                            <div className="flex">
                                <input placeholder='0x000000000000' type="text" value={toAddress} onChange={(e) => setToAddress(e.target.value)} className="border border-gray-300 h-11 p-2 rounded-md focus:outline-none me-2" />
                                <button onClick={handleRegister} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                        Register
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="input2" className="text-sm text-white mb-2">Unregister Address to Mint :</label>
                            <div className="flex">
                                <input placeholder='0x000000000000' type="text" value={unRegAddress} onChange={(e) => setunRegAddress(e.target.value)} className="border border-gray-300 h-11 p-2 rounded-md focus:outline-none me-2" />
                                <button onClick={handleUnregister} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                        Unregister
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {regAddress && showModal && (
                <RegModal regAddress={regAddress} onClose={handleModalClose} />
            )}
            {unregAddress && showModal && (
                <UnRegModal unregAddress={unregAddress} onClose={handleModalClose} />
            )}
        </div>
    );
};

export default Admin;

