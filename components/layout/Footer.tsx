import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MangoShop</h3>
            <p className="mb-4">
              Delivering fresh, high-quality mangoes directly from our farms to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-yellow-300">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-yellow-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-yellow-300">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-yellow-300">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-yellow-300">Products</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-yellow-300">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-300">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="hover:text-yellow-300">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-yellow-300">Returns & Exchanges</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-yellow-300">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>info@mangoshop.com</span>
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>123 Mango Street, Fruit City, FC 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-green-700 text-center">
          <p>&copy; {new Date().getFullYear()} MangoShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 