'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaLeaf, FaTruck, FaStar, FaMinus, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  id: string;
  name: string;
  image: string;
  shortDesc: string;
  description: string;
  price: number;
  stock: number;
}

export default function HomePage() {
  const router = useRouter();
  const [cookies] = useCookies(['token']);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        
        // Initialize quantities to 1 for all products
        const initialQuantities: Record<string, number> = {};
        data.forEach((product: Product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: string, change: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[productId] || 1;
      const newQuantity = Math.max(1, Math.min(products.find(p => p.id === productId)?.stock || 1, currentQuantity + change));
      return { ...prev, [productId]: newQuantity };
    });
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      if (!cookies.token) {
        router.push('/login');
        return;
      }

      setAddingToCart(productId);
      const quantity = quantities[productId] || 1;

      console.log('Adding to cart with token:', cookies.token);
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Cart API error:', data);
        
        if (response.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          router.push('/login');
          return;
        }
        throw new Error(data.error || 'Failed to add to cart');
      }

      const result = await response.json();
      console.log('Cart API success:', result);
      
      toast.success(`${quantity}kg of ${productName} added to cart!`);
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <main>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center bg-orange-600">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Fresh Mangoes Delivered to Your Doorstep
            </h1>
            <p className="text-xl mb-8">
              Experience the sweetest, juiciest mangoes from our carefully selected farms.
              Order now and get free shipping on orders over ₹500!
            </p>
            <Link
              href="/products"
              className="bg-yellow-400 text-orange-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center"
            >
              Shop Now
              <FaShoppingCart className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh from the Farm</h3>
              <p className="text-gray-600">
                Handpicked from our partner farms to ensure the highest quality.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick delivery to maintain freshness and quality.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                100% satisfaction guaranteed with every purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Mangoes</h2>
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-orange-100 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.shortDesc}</p>
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-orange-600">₹{product.price}/kg</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock}kg</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <button 
                            onClick={() => handleQuantityChange(product.id, -1)}
                            className="px-3 py-1 text-orange-600 hover:bg-orange-50"
                            disabled={quantities[product.id] <= 1}
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className="px-3 py-1 border-x">{quantities[product.id] || 1}</span>
                          <button 
                            onClick={() => handleQuantityChange(product.id, 1)}
                            className="px-3 py-1 text-orange-600 hover:bg-orange-50"
                            disabled={quantities[product.id] >= product.stock}
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(product.id, product.name)}
                          disabled={addingToCart === product.id || product.stock === 0}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                            product.stock === 0
                              ? 'bg-gray-300 cursor-not-allowed'
                              : addingToCart === product.id
                              ? 'bg-orange-300'
                              : 'bg-orange-600 hover:bg-orange-700'
                          } text-white transition-colors duration-200`}
                        >
                          <FaShoppingCart />
                          <span>
                            {product.stock === 0
                              ? 'Out of Stock'
                              : addingToCart === product.id
                              ? 'Adding...'
                              : 'Add to Cart'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8">
            Subscribe to our newsletter for the latest updates and exclusive offers!
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded text-gray-900"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-orange-900 px-6 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
} 