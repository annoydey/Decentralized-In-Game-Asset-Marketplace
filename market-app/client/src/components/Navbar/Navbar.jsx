import { useEffect, useState } from 'react';
import Img1 from "../../assets/blockchain.com-logo.png";
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import BittransferModal from '../Modal/BittransferModal';

const Navbar = ({ account, gameBitBalance, contract }) => {

    const [showgamebitModal, setshowgamebitModal] = useState(false);
    const [gamebitfromAddress, setgamebitfromAddress] = useState('');
    const [gamebittoAddress, setgamebittoAddress] = useState('');
    const [gamebitamount, setgamebitamount] = useState('');
    const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const fromAddress = account[0];

    const [transfertoAddress, setTransferToAddress] = useState('');
    const [amountGameBit, setAmountGameBit] = useState('');

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        checkMetamaskConnection();
    }, []);

    const checkMetamaskConnection = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setIsMetamaskConnected(true);
            } else {
                setIsMetamaskConnected(false);
            }
        } catch (error) {
            console.error("Error checking Metamask connection:", error);
        }
    };

    const connectToMetamask = async () => {
        try {
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setIsMetamaskConnected(true);
                console.log("Connected to Metamask successfully!");
            } else {
                console.error("Metamask extension not found");
            }
        } catch (error) {
            console.error("Error connecting to Metamask:", error);
        }
    };

    const transferFT = async () => {
        if (!contract.gameBit) {
            console.log("gameBit is not available yet");
            return;
        }
        const { gameBit } = contract;

        try {
            const amount = ethers.utils.parseUnits(amountGameBit, 18);

            const approvalTx = await gameBit.approve(fromAddress, amount);
            await approvalTx.wait();
            console.log("Approval:", approvalTx);

            const transaction = await gameBit.transferFrom(fromAddress, transfertoAddress, amount);
            await transaction.wait();
            setgamebitfromAddress(fromAddress);
            setgamebittoAddress(transfertoAddress);
            setgamebitamount(parseInt(amount));
            setshowgamebitModal(true);

            console.log("Transfer successful:", transaction);
        } catch (error) {
            console.error("Error during transfer:", error);
        }
    };


    useEffect(() => {
        const handleTransfer = (fromAddress, transfertoAddress, amount) => {
            setgamebitfromAddress(fromAddress);
            setgamebittoAddress(transfertoAddress);
            setgamebitamount(parseInt(amount));

            // Check if the modal should be displayed
            if (showgamebitModal) {
                setshowgamebitModal(true);
            }
        };

        if (contract && contract.gameBit) {
            const { gameBit } = contract;

            gameBit.on("Transfer", handleTransfer);

            return () => {
                gameBit.off("Transfer", handleTransfer);
            };
        } else {
            console.error("Either contract or its properties are not available yet");
        }
    }, [contract, showgamebitModal]);



    const handletransferGamebit = () => {
        transferFT();
    };

    const handlegamebittransferModalClose = () => {
        setshowgamebitModal(false);
    };

    return (
        <nav className="relative px-4 py-4 flex justify-between items-center bg-gray-900">
            <Link to="/" className="text-3xl font-bold leading-none">
                <svg className="h-10" alt="logo" viewBox="0 0 10240 10240">
                    <image href={Img1} width="100%" height="100%" alt="logo" />
                </svg>
            </Link>
            <div className="lg:hidden">
                <button onClick={toggleMobileMenu} className="navbar-burger flex items-center text-blue-600 absolute right-3">
                    <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Mobile menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                    </svg>
                </button>

                {isMobileMenuOpen && (
                    <div className="navbar-menu relative z-50">
                        <div onClick={closeMobileMenu} className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
                        <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-gray-900 border-r overflow-y-auto">
                            <div className="flex items-center mb-8">
                                <Link to="/" className="mr-auto text-3xl font-bold leading-none">
                                    <svg className="h-10" alt="logo" viewBox="0 0 10240 10240">
                                        <image href={Img1} width="100%" height="100%" />
                                    </svg>
                                </Link>
                                <button onClick={closeMobileMenu} className="navbar-close">
                                    <svg className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <ul>
                                    <li className="mb-1">
                                        <Link to="/" onClick={closeMobileMenu} className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
                                            Home
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <Link to="/about" onClick={closeMobileMenu} className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
                                            About
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <Link to="/mint" onClick={closeMobileMenu} className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
                                            Mint
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <Link to="/list" onClick={closeMobileMenu} className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
                                            List
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <Link to="/admin" onClick={closeMobileMenu} className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
                                            Admin
                                        </Link>
                                    </li>
                                    <li className="mb-1">
                                        <a className="block p-4 text-sm font-semibold text-green-400 hover:bg-red-50 hover:text-blue-600 rounded" href="#">
                                            Address
                                            <span>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    value={account && Array.isArray(account) ? account[0] : ''}
                                                    readOnly
                                                    className="block w-full rounded-md border-0 py-1.5 pl-1 text-red-500 font-bold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    placeholder="Connect Wallet"
                                                />
                                            </span>
                                        </a>
                                    </li>
                                    <li className="mb-1">
                                        <a className="block p-4 text-sm font-semibold text-green-400 hover:bg-red-50 hover:text-blue-600 rounded" href="#">
                                            GameBit:
                                            <span>
                                                <input
                                                    type="text"
                                                    value={gameBitBalance}
                                                    readOnly
                                                    className="block w-full rounded-md border-0 py-1.5 pl-1 text-purple-700 font-bold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </span>
                                        </a>
                                    </li>
                                    <li className="mb-1">
                                        <a className="block p-4 text-sm font-semibold text-green-400 hover:bg-red-50 hover:text-blue-600 rounded" href="#">
                                            Address
                                            <span>
                                                <input
                                                    type="text"
                                                    value={transfertoAddress}
                                                    onChange={(e) => setTransferToAddress(e.target.value)} 
                                                    className="block w-full rounded-md border-0 py-1.5 pl-1 text-red-500 font-bold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    placeholder="To: 0x0000000000"
                                                />
                                            </span>
                                        </a>
                                    </li>
                                    <li className="mb-1">
                                        <a className="block p-4 text-sm font-semibold text-green-400 hover:bg-red-50 hover:text-blue-600 rounded" href="#">
                                            Amount
                                            <span>
                                                <input
                                                    type="text"
                                                    value={amountGameBit}
                                                    onChange={(e) => setAmountGameBit(e.target.value)}
                                                    className="block w-full rounded-md border-0 py-1.5 pl-1 text-purple-700 font-bold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </span>
                                        </a>
                                    </li>
                                    <li className="mb-1">
                                        <button onClick={handletransferGamebit} className="ms-4 inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                Transfer Gamebit
                                            </span>
                                        </button>
                                    </li>
                                    <li className="mt-3">
                                        <button
                                            onClick={connectToMetamask}
                                            className={`ms-4 inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group ${
                                                isMetamaskConnected
                                                    ? 'bg-gradient-to-br from-green-500 to-blue-500 group-hover:from-green-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800'
                                                    : 'bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'
                                            }`}
                                        >
                                            <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                {isMetamaskConnected ? 'Metamask Connected' : 'Connect Metamask'}
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
            <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-2">
                <li><Link to="/" className="text-sm text-gray-400 hover:text-blue-600 font-bold">Home</Link></li>
                <li className="text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </li>
                <li><Link to="/about" className="text-sm text-gray-400 hover:text-blue-600 font-bold">About</Link></li>
                <li className="text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </li>
                <li><Link to="/mint" className="text-sm text-gray-400 hover:text-blue-600 font-bold">Mint</Link></li>
                <li className="text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </li>
                <li><Link to="/list" className="text-sm text-gray-400 hover:text-blue-600 font-bold">List</Link></li>
                <li className="text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </li>
                <li><Link to="/admin" className="text-sm text-gray-400 hover:text-blue-600 font-bold">Admin</Link></li>
                <li className="text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </li>
                <li><a className="text-sm text-green-400 font-bold">Address</a></li>
                <li className="text-gray-300">
                    <input type="text" name="address" id="address" value={account && Array.isArray(account) ? account[0] : ''} readOnly placeholder="Connect Wallet" className="h-7 text-red-600 font-bold bg-gray-100 border-none focus:outline-none p-2 rounded-md w-40" />
                </li>
                <li><a className="text-sm text-green-400 font-bold">GameBit:</a></li>
                <li className="text-gray-300">
                    <input type="text" value={gameBitBalance} readOnly className="h-7 text-purple-700 font-bold bg-gray-100 border-none focus:outline-none p-2 rounded-md w-20" />
                </li>
                <li><a className="text-sm text-green-400 font-bold">Address</a></li>
                <li className="text-gray-300">
                    <input type="text" name="address" value={transfertoAddress} onChange={(e) => setTransferToAddress(e.target.value)} placeholder="To: 0x0000000000" className="h-7 text-red-600 font-bold bg-gray-100 border-none focus:outline-none p-2 rounded-md w-40" />
                </li>
                <li><a className="text-sm text-green-400 font-bold">Amount:</a></li>
                <li className="text-gray-300">
                    <input type="text" placeholder='100' value={amountGameBit} onChange={(e) => setAmountGameBit(e.target.value)} className="h-7 text-purple-700 font-bold bg-gray-100 border-none focus:outline-none p-2 rounded-md w-20" />
                </li>
                <li>
                    <button onClick={handletransferGamebit} className="inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Transfer Gamebit
                        </span>
                    </button>
                </li>
                <li>
                    <button
                        onClick={connectToMetamask}
                        className={`ms-4 inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group ${
                            isMetamaskConnected
                                ? 'bg-gradient-to-br from-green-500 to-blue-500 group-hover:from-green-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800'
                                : 'bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800'
                        }`}
                    >
                        <span className="relative px-2 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            {isMetamaskConnected ? 'Metamask Connected' : 'Connect Metamask'}
                        </span>
                    </button>
                </li>
            </ul>
            {gamebitfromAddress && showgamebitModal && gamebittoAddress && gamebitamount && (
                <BittransferModal gamebitfromAddress={gamebitfromAddress} gamebittoAddress={gamebittoAddress} gamebitamount={gamebitamount} onClose={handlegamebittransferModalClose} />
            )}
        </nav>
    );
};

export default Navbar;