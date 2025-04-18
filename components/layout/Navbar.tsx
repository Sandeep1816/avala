import React from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-700">
            Mango<span className="text-yellow-500">Shop</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-green-600">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600">
              Contact
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="text-gray-700 hover:text-green-600 relative">
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              <Link href="/profile" className="text-gray-700 hover:text-green-600">
                <FaUser className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 