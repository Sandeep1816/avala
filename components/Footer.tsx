import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mango</h3>
            <p className="text-gray-400">
              Your one-stop shop for all your needs. Quality products at great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-white">
                  Special Deals
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <FaPhone className="mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center text-gray-400">
                <FaEnvelope className="mr-2" />
                support@mango.com
              </li>
              <li className="flex items-center text-gray-400">
                <FaMapMarkerAlt className="mr-2" />
                123 Mango Street, City, Country
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mango. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 