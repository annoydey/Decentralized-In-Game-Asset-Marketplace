import * as React from "react";
import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ethers } from 'ethers';
import GameItemABI from '../../../market-contract/artifacts/contracts/GameItem.sol/GameItem.json';
import GameBitABI from '../../../market-contract/artifacts/contracts/GameBit.sol/GameBit.json';
import GameAssetMarketABI from '../../../market-contract/artifacts/contracts/GameAssetMarket.sol/GameAssetMarket.json';
import contractAddresses from '../../../market-contract/contractAddresses.json';
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Mint from "./components/Mint/Mint.jsx";
import List from "./components/List/List.jsx";
import Admin from "./components/Admin/Admin.jsx";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    gameBit:null,
    gameItem:null,
    gameAssetMarket:null
  });

  const [account, setAccount] = useState("Not Connected");
  const [gameBitBalance, setgameBitBalance] = useState(0);

  useEffect(() => {
    const template = async () => {
      const gameBitAddress=contractAddresses.GameBit;
      const gameBitABI=GameBitABI.abi;

      const gameItemAddress=contractAddresses.GameItem;
      const gameItemABI=GameItemABI.abi;

      const gameAssetMarketAddress=contractAddresses.GameAssetMarket;
      const gameAssetMarketABI=GameAssetMarketABI.abi;

      try {
        const { ethereum } = window;

        ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts);
        });
    
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
    
        
        setAccount(accounts);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
    
        const gameBit = new ethers.Contract(
          gameBitAddress,
          gameBitABI,
          signer
        );
  
        const gameItem = new ethers.Contract(
          gameItemAddress,
          gameItemABI,
          signer
        );
  
        const gameAssetMarket = new ethers.Contract(
          gameAssetMarketAddress,
          gameAssetMarketABI,
          signer
        );

      setState({provider, signer, gameBit, gameItem, gameAssetMarket});
    
      } catch (error) {
        alert.error(error);
      }
    };

    template();

    return () => {
      const { ethereum } = window;
      if (ethereum) {
        ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!state.gameBit) {
        return;
    }
      const { gameBit } = state;
      try {
        if (gameBit && Array.isArray(account) && account.length > 0) {
          const tokenBalances = await Promise.all(
            account.map(async (acc) => {
              const tokenBalance = await gameBit.balanceOf(acc);
              const formattedTokenBalance = ethers.utils.formatUnits(tokenBalance, 18);
              return { formattedTokenBalance };
            })
          );
          const firstTokenBalance = tokenBalances[0].formattedTokenBalance;
          setgameBitBalance(firstTokenBalance);
        } else {
          console.error("GameBit contract is not defined in state");
        }
      } catch (error) {
        console.error("Error fetching GBT token balances:", error);
      }
    };
  
    fetchTokenBalance();
  }, [state.gameBit, account]);
  

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home contract={state} account={account} gameBitBalance={gameBitBalance} />,
    },
    {
      path: "/about",
      element: <About contract={state} account={account} gameBitBalance={gameBitBalance} />,
    },
    {
      path: "/mint",
      element: <Mint contract={state} account={account} gameBitBalance={gameBitBalance} />,
    },
    {
      path: "/list",
      element: <List contract={state} account={account} gameBitBalance={gameBitBalance} />,
    },
    {
      path: "/admin",
      element: <Admin contract={state} account={account} gameBitBalance={gameBitBalance} />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
