import React from 'react';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import contractAddresses from '../../../../../market-contract/contractAddresses.json';
import UpdatelistModal from '../Modal/UpdatelistModal';
import DelistModal from '../Modal/DelistModal';
import "./ProductListCard.css"
import defaultNFT from '../../assets/images/default_nft.png'

const ProductListCard = ({ contract, account }) => {

    const [listings, setListings] = useState([]);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [newPrice, setNewPrice] = useState('');
    const [selectedTokenId, setSelectedTokenId] = useState('');
    const [updateId, setUpdateId] = useState('');
    const [updatePrice, setUpdatePrice] = useState('');
    const [delisttokenId, setDelisttokenId] = useState('');
    const [isContractReady, setIsContractReady] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showdelistModal, setShowdelistModal] = useState(false);

    const delist = async (tokenId) => {
        if (!contract.gameItem) {
            console.log("gameItem is not available yet");
            return;
        }
        if (!contract.gameAssetMarket) {
            console.log("gameAssetMarket is not available yet");
            return;
        }

        const { gameItem } = contract;
        const { gameAssetMarket } = contract;
        
        console.log("Card div token id: ", tokenId)
        console.log("Listings array: ", listings)
        console.log("tokenId index in listings array: ", listings[tokenId])

        try {
            const approvalNFT = await gameItem.approve("0x0", tokenId);
            await approvalNFT.wait();
            console.log("Approval:", approvalNFT);
        } catch (error) {
            console.error("Error during NFT approval")
        }
        try {
            const delistTransaction = await gameAssetMarket.delist(tokenId);
            const delistReceipt = await delistTransaction.wait();
            setDelisttokenId(tokenId)
            setShowdelistModal(true);
            console.log("deisting", delistReceipt)

        } catch(error){
            console.log("Error - delist", error)
        }
    }

    const handleDelist = (tokenId) => (event) => {
        event.preventDefault();
        delist(tokenId);
    };

    

    const updateListing = async () => {
        if (!contract.gameAssetMarket) {
            console.log("gameAssetMarket is not available yet");
            return;
        }

        const { gameAssetMarket } = contract;

        console.log("Card div token id: ", selectedTokenId)
        console.log("Listings array: ", listings)
        console.log("tokenId index in listings array: ", listings[selectedTokenId])

        try {
            console.log("inside update function", typeof(selectedTokenId, newPrice))
            const updatePrice = await gameAssetMarket.updateListing(selectedTokenId, newPrice);
            await updatePrice.wait();
            console.log("updatePrice:", updatePrice);
            getListings();
            gameAssetMarket.on("UpdateListing", (tokenId, price) => {
                setUpdateId(parseInt(tokenId));
                setUpdatePrice(parseInt(price));
                setShowModal(true)
            });
        } catch (error) {
            console.error("Error during updatePrice")
        }
    }

    const handleUpdateListing = (event, tokenId) => {
        setIsUpdateModalOpen(true);
        setSelectedTokenId(tokenId);
        event.preventDefault();
    };

    const handleUpdatePrice = () => {
        if (selectedTokenId !== null) {
          updateListing(selectedTokenId, newPrice);
          setSelectedTokenId('');
          setIsUpdateModalOpen(false);
        }
    };

    const handleModalClose = () => {
        setShowModal(false)
    };

    const handleupdatemodalClose = () => {
        setIsUpdateModalOpen(false);
    };

    const handledelistmodalClose = () => {
        setShowdelistModal(false)
    };


    const buyNFT = async (tokenId3) => {
        if (!contract.gameBit) {
            console.log("gameBit is not available yet");
            return;
        }
        if (!contract.gameAssetMarket) {
            console.log("gameAssetMarket is not available yet");
            return;
        }
        
        const { gameBit } = contract;
        const { gameAssetMarket } = contract;
        
        console.log("Card div token id: ", tokenId3)
        console.log("Listings array: ", listings)
        console.log("tokenId index in listings array: ", listings[tokenId3])

        try {
            // const idIndex = listings.findIndex(element => element.tokenId === tokenId3);
            // console.log(idIndex);
            const amount = ethers.utils.parseUnits(listings[tokenId3].price, 18);
            const approvalFT = await gameBit.approve(contractAddresses.GameAssetMarket, amount);
            await approvalFT.wait();
            console.log("GameBit transfer approved:", approvalFT);

            const amount2 = ethers.utils.parseUnits(listings[tokenId3].price, 18);
            const buy = await gameAssetMarket.buySellItem(listings[tokenId3].address, account[0], tokenId3, amount2);
            await buy.wait();
            console.log("Successful transfer of GameBit and NFT:", buy);
        } catch (error) {
            console.error("Error during GameBit approval:", error);
            console.error("tokenId", listings[tokenId3].tokenId);
            console.error("price", listings[tokenId3].price);
        }
    };

    const handleBuyNFT = (tokenId) => (event) => {
        event.preventDefault();
        buyNFT(tokenId);
        console.log(tokenId)
    }

    const getListings = async () => {
        if (!contract.gameAssetMarket) {
            console.log("gameAssetMarket is not available yet");
            return;
        }

        const { gameAssetMarket } = contract;

        try {
            const listings = await gameAssetMarket.retreiveListings();
            // const nonZero = listings.filter(tuple => parseInt(tuple[1].toString()) > 0);
            const allListings = listings.map(tuple => ({
                address: tuple[0].toString(),
                price: tuple[1].toString(),
                tokenId: tuple[2].toString(),
                uri: "https://ipfs.io/ipfs/" + tuple[3].toString().slice(7)
            }));
            setListings(allListings);
            console.log(listings[0].price);
        } catch (error) {
            console.log("Currently no listed items");
        }
    };

    useEffect(() => {
        const checkAndFetchListings = async () => {
            if (contract && contract.gameAssetMarket) {
                setIsContractReady(true);
                await getListings();
            }
        };
    
        checkAndFetchListings();
    }, [contract]);
    
    return (
        <div>
            <div className="mx-auto mt-6 mr-6 mb-6 ml-6">
                <div className="flex flex-col gap-8">
                    <div>
                        {updateId.length != '' && showModal &&
                            <UpdatelistModal updateId={updateId} updatePrice={updatePrice} onClose={handleModalClose} />
                        }
                        {delisttokenId.length !='' && showdelistModal && (
                            <DelistModal delisttokenId={delisttokenId} onClose={handledelistmodalClose} />
                        )}
                    </div>
                    {listings.map((listing, index) => (
                        <React.Fragment key={index}>
                            {listing.price > 0 &&
                                <div className="product-card-container bg-gray-900 p-4 rounded-md shadow-md hover:shadow-lg flex items-centerbg-gray-900 p-4 rounded-md shadow-md hover:shadow-lg flex items-center justify-center">
                                    <div>
                                        <img 
                                            src={listing.uri}
                                            style={{width: '200px', height: '200px'}}
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null; // prevents looping
                                                currentTarget.src=defaultNFT;
                                            }}
                                            />
                                    </div>
                                    <div className="flex flex-col flex-grow items-center justify-center">
                                        <div className="productcard p-4 rounded-md shadow-md">
                                            <div className="flex-row">
                                                <dt className="text-sm font-medium text-white text-center">Token ID : {listing.tokenId}</dt>
                                            </div>
                                            <div className="flex-row">
                                                <dt className="text-sm font-medium text-white text-center">Seller : {listing.address}</dt>
                                            </div>
                                            <div className="flex-row">
                                                <dt className="text-sm font-medium text-white text-center">Price : {listing.price}</dt>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {listing.address.toLowerCase() == account[0].toLowerCase() ? (
                                            <div className="flex flex-col items-end  ml-auto">
                                                <button onClick={(event) => handleUpdateListing(event, listing.tokenId)} className="ms-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 mt-5 mb-2">
                                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                    Update
                                                    </span>
                                                </button>
                                                <button onClick={handleDelist(listing.tokenId)} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 mt-2 mb-2">
                                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                    Delist
                                                    </span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-end  ml-auto">
                                                <button onClick={handleBuyNFT(listing.tokenId)} type="button" className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mt-2 mb-2">
                                                    <svg className="w-4 h-4 me-2 -ms-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="bitcoin" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path fill="currentColor" d="M504 256c0 136.1-111 248-248 248S8 392.1 8 256 119 8 256 8s248 111 248 248zm-141.7-35.33c4.937-32.1-20.19-50.74-54.55-62.57l11.15-44.7-27.21-6.781-10.85 43.52c-7.154-1.783-14.5-3.464-21.8-5.13l10.93-43.81-27.2-6.781-11.15 44.69c-5.922-1.349-11.73-2.682-17.38-4.084l.031-.14-37.53-9.37-7.239 29.06s20.19 4.627 19.76 4.913c11.02 2.751 13.01 10.04 12.68 15.82l-12.7 50.92c.76 .194 1.744 .473 2.829 .907-.907-.225-1.876-.473-2.876-.713l-17.8 71.34c-1.349 3.348-4.767 8.37-12.47 6.464 .271 .395-19.78-4.937-19.78-4.937l-13.51 31.15 35.41 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.26 45.21 27.18 6.781 11.15-44.73a1038 1038 0 0 0 21.69 5.627l-11.11 44.52 27.21 6.781 11.26-45.13c46.4 8.781 81.3 5.239 95.99-36.73 11.84-33.79-.589-53.28-25-65.99 17.78-4.098 31.17-15.79 34.75-39.95zm-62.18 87.18c-8.41 33.79-65.31 15.52-83.75 10.94l14.94-59.9c18.45 4.603 77.6 13.72 68.81 48.96zm8.417-87.67c-7.673 30.74-55.03 15.12-70.39 11.29l13.55-54.33c15.36 3.828 64.84 10.97 56.85 43.03z"></path>
                                                    </svg>
                                                    Buy
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            }
                        </React.Fragment>
                    ))}
                </div>

                {isUpdateModalOpen && (
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                            </span>

                            <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-headline"
                            >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Update Price
                                    </h3>
                                    <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="Enter new price"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        className="p-2 border rounded-md w-full"
                                    />
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={handleUpdatePrice} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#FF9119] text-base font-medium text-white hover:bg-[#FF9119]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9119]/50 sm:ml-3 sm:w-auto sm:text-sm">
                                Update
                                </button>
                                <button onClick={handleupdatemodalClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
                                Cancel
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListCard;