import React from 'react';
import Harita from '../components/Harita';
import Store from '../components/Store';
import ContactForm from '../components/ContactForm';



const Contact = () => {
  return (
    <>
    <section className="relative bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-16 lg:py-24 overflow-hidden">
      {/* Dekorativ elementlər */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute right-8 bottom-8 w-16 h-16 bg-indigo-200/20 rounded-full blur-lg"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center space-x-2 text-sm md:text-base text-blue-600 mb-4">
          <a href="/" className="hover:text-blue-800 transition-colors">Home</a>
          <svg 
            className="w-4 h-4 text-blue-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 5l7 7-7 7" 
            />
          </svg>
          <span className="text-blue-800 font-medium">Contact</span>
        </nav>

        {/* Başlıq və dekorativ xətt */}
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mb-8"></div>
        </div>
      </div>
    </section>
    <Store />
    <Harita />
    <ContactForm />
    </>
  );
};

export default Contact;