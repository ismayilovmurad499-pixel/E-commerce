import React from 'react';
import Product from '../components/Product';


const Shop = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-14 px-8 md:px-24 flex flex-col md:flex-row justify-between items-center shadow-xl rounded-lg">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Shop - Full Width
          </h1>
          <p className="text-gray-200 font-medium mt-2 text-lg">
            HOME / <span className="text-white font-semibold">SHOP</span>
          </p>
        </div>
        <img
          src="https://res.cloudinary.com/dwdvr0oxa/image/upload/v1739266328/banner_eqhh6u.png"
          alt="Product"
          className="h-40 md:h-52 lg:h-60 object-contain drop-shadow-xl transition-all duration-500 hover:scale-105"
        />
      </div>
      <Product />
    </>
  );
};

export default Shop;
