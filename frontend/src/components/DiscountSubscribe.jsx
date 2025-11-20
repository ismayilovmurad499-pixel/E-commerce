import React from "react";

const DiscountSubscribe = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get <span className="text-gray-600">30% Off</span>
          </h2>
          <p className="text-gray-500 mb-8 text-lg">
            Enter your email to receive exclusive offers
          </p>
          
          {/* Abunə formu */}
          <form className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-5 py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent placeholder-gray-400 text-gray-700 transition-all shadow-sm"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DiscountSubscribe;