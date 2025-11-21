import React from 'react';
import Product from '../components/Product';

const Shop = () => {
  return (
    <div className="container mx-auto px-4 py-8"> {/* Səhifə kənarlarından boşluq */}
      
      {/* Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl">
        
        {/* Dekorativ Arxa Fon Elementləri (Dairələr) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full mix-blend-overlay blur-3xl -translate-x-16 -translate-y-16 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 opacity-20 rounded-full mix-blend-overlay blur-3xl translate-x-20 translate-y-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col-reverse md:flex-row justify-between items-center px-8 py-16 md:px-24 lg:py-20 gap-8">
          
          {/* Sol tərəf: Yazılar */}
          <div className="text-center md:text-left space-y-6 max-w-lg">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">Full Width</span>
            </h1>
            
            {/* Modern Breadcrumb */}
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full">
              <span className="text-blue-100 text-sm font-medium hover:text-white transition-colors cursor-pointer">HOME</span>
              <span className="text-white/40">/</span>
              <span className="text-white text-sm font-bold tracking-wide">SHOP</span>
            </div>
          </div>

          {/* Sağ tərəf: Şəkil */}
          <div className="relative group">
            {/* Şəkil arxasında işıq effekti */}
            <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
            
            <img
              src="https://res.cloudinary.com/dwdvr0oxa/image/upload/v1739266328/banner_eqhh6u.png"
              alt="Product Banner"
              className="relative z-10 h-48 md:h-64 lg:h-72 object-contain drop-shadow-2xl transform transition-all duration-500 hover:-translate-y-4 hover:scale-105 hover:rotate-2"
            />
          </div>
        </div>
      </div>

      {/* Product Component */}
      <div className="mt-16">
        <Product />
      </div>
    </div>
  );
};

export default Shop;