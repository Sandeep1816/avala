'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

interface Product {
  id: string;
  name: string;
  image: string;
  shortDesc: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const [cookies] = useCookies(['token']);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      if (!cookies.token) {
        router.push('/login');
        return;
      }

      setError(null);
      setSuccessMessage(null);
      setAddingToCart(productId);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(data.error || 'Failed to add to cart');
      }

      const data = await response.json();
      setSuccessMessage(`${productName} added to cart successfully!`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Products</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.shortDesc}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-orange-500">₹{product.price}</span>
                <button
                  onClick={() => handleAddToCart(product.id, product.name)}
                  disabled={addingToCart === product.id || product.stock === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                    product.stock === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : addingToCart === product.id
                      ? 'bg-orange-300'
                      : 'bg-orange-500 hover:bg-orange-600'
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
        ))}
      </div>
    </div>
  );
} 