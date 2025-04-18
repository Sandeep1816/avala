import Link from 'next/link';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-500">Mango</span>
            </Link>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Search products..."
                  type="search"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Link href="/cart" className="p-2 text-gray-400 hover:text-gray-500">
              <FaShoppingCart className="h-6 w-6" />
            </Link>
            <Link href="/profile" className="ml-4 p-2 text-gray-400 hover:text-gray-500">
              <FaUser className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 