import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Modal from '../Modal/Modal';

const Mint = ({contract, account, gameBitBalance }) => {

    const [nftMetadata, setnftMetadata] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [showmintmodal, setShowMintModal] = useState(false);

    const mint = async () => {
        if (!contract.gameItem) {
            console.log("gameItem is not available yet");
            return;
        }
        const { gameItem } = contract;

        try {
            const mintedItem = await gameItem.mintItem(account[0], nftMetadata);
            await mintedItem.wait()
            gameItem.on("Minted", (tokenId) => {
                console.log(parseInt(tokenId));
                setTokenId(parseInt(tokenId));
                setShowMintModal(true);
            });
            console.log("Minted Item:", mintedItem);
        } catch (error) {
            console.error("Error minting item:", error);
        }
    };

    useEffect(() => {
        const handleMinted = (tokenId) => {
          console.log(parseInt(tokenId));
          setTokenId(parseInt(tokenId));
          if(showmintmodal == true){
            setShowMintModal(true)
          }
        };
    
        if (contract.gameItem) {
          const { gameItem } = contract;
          gameItem.on("Minted", handleMinted);
    
          return () => {
            gameItem.off("Minted", handleMinted);
          };
        }
      }, [contract.gameItem]);
    
    

    const handleMint = () => {
        mint();
    }

    const handleModalClose = () => {
        setShowMintModal(false);
    };

    return (
        <div className="bg-blue-500 min-h-screen flex flex-col">
            <Navbar account={account} gameBitBalance={gameBitBalance} contract={contract}></Navbar>
            <div className="bg-black p-4 rounded-md shadow-md hover:shadow-lg mt-6 mr-6 mb-6 ml-6">
                <h1 className="text-xl font-bold text-center text-white">Mint</h1>
            </div>
            <div className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg mt-6 mx-auto mb-6 flex flex-col items-center">
                <div className="mb-4">
                    <div className="flex flex-col mb-2">
                        <label htmlFor="input1" className="text-sm text-white mb-2">TokenURI :</label>
                        <div className="flex">
                            <input type="text" placeholder='ipfs://nft_cid' value={nftMetadata} onChange={(e) => setnftMetadata(e.target.value)} className="border border-gray-300 h-11 p-2 rounded-md focus:outline-none me-2" />
                            <button onClick={handleMint} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Mint
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* {tokenId.length != '' &&
                <div className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg mt-6 mx-auto mb-6 flex flex-col items-center">
                    <p className="text-white">Your minted TokenID is {tokenId}</p>
                </div>
            } */}
            {showmintmodal && (
                <Modal tokenId={tokenId} onClose={handleModalClose} />
            )}
        </div>
    );
};

export default Mint;