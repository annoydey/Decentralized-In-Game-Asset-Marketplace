import React from 'react';
import Navbar from '../Navbar/Navbar';
import ProductListCard from '../ProductList/ProductListCard';

const Home = ({contract, account, gameBitBalance}) => {
  
  return (
    <>
      <div className="bg-blue-500 min-h-screen flex flex-col">
        <Navbar account={account} gameBitBalance={gameBitBalance} contract={contract}/>
        <div className="bg-black p-4 rounded-md shadow-md hover:shadow-lg mt-6 mr-6 mb-6 ml-6">
          <h1 className="text-xl font-bold text-center text-white">Game Assets</h1>
        </div>
        <ProductListCard contract={contract} account={account}></ProductListCard>
      </div>
    </>
  );
};

export default Home;
