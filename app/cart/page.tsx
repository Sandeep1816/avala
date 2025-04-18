'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    stock: number;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cookies] = useCookies(['token']);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!cookies.token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/cart', {
          headers: {
            'Authorization': `Bearer ${cookies.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        setCartItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [cookies.token, router]);

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      setUpdatingItem(cartItemId);
      
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          cartItemId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update quantity');
      }

      const updatedItem = await response.json();
      
      // Update local state
      setCartItems(cartItems.map(item => 
        item.id === cartItemId ? updatedItem : item
      ));
      
      toast.success('Cart updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      setRemovingItem(cartItemId);
      
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({ cartItemId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove item from cart');
      }

      // Update local state
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setRemovingItem(null);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateGST = () => {
    // 18% GST
    return calculateSubtotal() * 0.18;
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Free shipping for orders over ₹500
    return subtotal > 500 ? 0 : 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST() + calculateShipping();
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
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is currently empty</p>
            <Link 
              href="/" 
              className="inline-block bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-gray-700">Product</th>
                    <th className="px-4 py-3 text-center text-gray-700">Quantity</th>
                    <th className="px-4 py-3 text-right text-gray-700">Price</th>
                    <th className="px-4 py-3 text-right text-gray-700">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="relative w-16 h-16 mr-4">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <span className="font-medium">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updatingItem === item.id || item.quantity <= 1}
                            className="px-2 py-1 text-orange-600 hover:bg-orange-50 rounded-l-md disabled:opacity-50"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="px-3 py-1 border-x">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updatingItem === item.id || item.quantity >= item.product.stock}
                            className="px-2 py-1 text-orange-600 hover:bg-orange-50 rounded-r-md disabled:opacity-50"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">₹{item.product.price}/kg</td>
                      <td className="px-4 py-3 text-right font-medium">
                        ₹{item.product.price * item.quantity}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItem === item.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Link 
                href="/" 
                className="text-orange-600 hover:text-orange-800 inline-flex items-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{calculateGST()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {calculateShipping() === 0 ? 'Free' : `₹${calculateShipping()}`}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-orange-600">
                    ₹{calculateTotal()}
                  </span>
                </div>
              </div>
              
              <button
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 flex items-center justify-center"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 