import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { ethers } from 'ethers';
import contractAddresses from '../../../../../market-contract/contractAddresses.json';
import Modallist from '../Modal/Modallist';

const List = ({contract, account, gameBitBalance }) => {

    const [tokenID, settokenID] = useState('');
    const [price, setprice] = useState('');
    const [listingId, setListingId] = useState('');
    const [listingPrice, setListingPrice] = useState('');
    const [showModal, setShowModal] = useState(false);
    

    const list = async () => {
        console.log("test")
        if (!contract.gameAssetMarket) {
            console.log("gameAssetMarket is not available yet");
            return;
        }
        if (!contract.gameItem) {
            console.log("gameItem is not available yet");
            return;
        }
        const { gameAssetMarket } = contract;
        const { gameItem } = contract;
        console.log("tokenid", tokenID);
        console.log("price", price);

        try {
            const approvalNFT = await gameItem.approve(contractAddresses.GameAssetMarket, tokenID);
            await approvalNFT.wait();
            console.log("Approval:", approvalNFT);

            const listItem = await gameAssetMarket.list(tokenID, price);
            await listItem.wait()
            gameAssetMarket.on("Listed", (tokenId, price) => {
                setListingId(parseInt(tokenId));
                setListingPrice(parseInt(price));
                setShowModal(true);
            });
        } catch (error) {
            console.error("Error during NFT approval or list")
        }
    };

    useEffect(() => {
        const handleListed = (tokenId, price) => {
            setListingId(parseInt(tokenId));
            setListingPrice(parseInt(price));
            if(showModal == true){
                setShowModal(true)
            }
        };
    
        if (contract.gameAssetMarket) {
            const { gameAssetMarket } = contract;
            gameAssetMarket.on("Listed", handleListed);
    
            return () => {
                gameAssetMarket.off("Listed", handleListed);
            };
        }
    }, [contract.gameAssetMarket]);
    

    const handleList = (event) => {
        event.preventDefault(); 
        list();
    }

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className="bg-blue-500 min-h-screen flex flex-col">
        <Navbar account={account} gameBitBalance={gameBitBalance} contract={contract}></Navbar>
        <div className="bg-black p-4 rounded-md shadow-md hover:shadow-lg mt-6 mr-6 mb-6 ml-6">
            <h1 className="text-xl font-bold text-center text-white">List</h1>
        </div>
        <div className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg mt-6 mx-auto mb-6 flex flex-col items-center">
            <form className="flex flex-col mb-4">
                <label htmlFor="tokenId" className="text-sm text-white mb-2">TokenID :</label>
                <input type="text" placeholder='0' value={tokenID} onChange={(e) => settokenID(e.target.value)} className="border border-gray-300 h-8 p-2 rounded-md focus:outline-none mb-2" />
                <label htmlFor="price" className="text-sm text-white mb-2">Price :</label>
                <div className="flex">
                    <input type="text" placeholder='100' value={price} onChange={(e) => setprice(e.target.value)}  className="border border-gray-300 h-11 p-2 rounded-md focus:outline-none me-2" />
                    <button onClick={handleList} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                           Enter
                        </span>
                    </button>
                </div>
            </form>
        </div>
        {/* {listingId.length != '' &&
                <div className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg mt-6 mx-auto mb-6 flex flex-col items-center">
                    <p className="text-white">TokenID {listingId} is listed for {listingPrice} GameBit</p>
                </div>
            } */}
        {showModal && (
            <Modallist listingId={listingId} listingPrice={listingPrice} onClose={handleModalClose} />
        )}
    </div>
    
    );
};

export default List;
