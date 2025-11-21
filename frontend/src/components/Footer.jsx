import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Anvogue</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold">Mail:</span> hi.avitex@gmail.com
              </p>
              <p>
                <span className="font-semibold">Phone:</span> 1-333-345-6868
              </p>
              <p>
                <span className="font-semibold">Address:</span> 549 Oak St.Crystal Lake, IL 60014
              </p>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase">Information</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Career
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  My Account
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Order & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Shop */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase">Quick Shop</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Women
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Men
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Clothes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Accessories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase">Customer Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  Return & Refund
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase">Newsletter</h3>
            <p className="text-gray-700 mb-4 text-sm">
              Sign up for our newsletter and get 10% off your first purchase
            </p>
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Enter your e-mail"
                className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-400 text-sm"
              />
              <button className="bg-black text-white px-3 py-2 hover:bg-gray-800 transition-colors duration-300">
                →
              </button>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-400 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-700 hover:text-red-500 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <p className="text-gray-700 text-sm">©2024 Anvogue. All Rights Reserved.</p>
              <select className="bg-transparent border-none text-gray-700 cursor-pointer text-sm focus:outline-none">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
              <select className="bg-transparent border-none text-gray-700 cursor-pointer text-sm focus:outline-none">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 text-sm">Payment:</span>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                <div className="w-10 h-7 bg-red-600 rounded flex items-center justify-center">
                  <div className="flex">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-500 rounded-full -ml-2"></div>
                  </div>
                </div>
                <div className="w-10 h-7 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
                <div className="w-10 h-7 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">PP</div>
                <div className="w-10 h-7 bg-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">DC</div>
                <div className="w-10 h-7 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">D</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer