'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

interface OrderSummary {
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cookies] = useCookies(['token']);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'card',
  });

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

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateGST = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST() + calculateShipping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setProcessingPayment(true);

      const orderSummary: OrderSummary = {
        subtotal: calculateSubtotal(),
        gst: calculateGST(),
        shipping: calculateShipping(),
        total: calculateTotal(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          shipping: formData,
          summary: orderSummary,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process order');
      }

      const order = await response.json();
      
      // Clear the cart
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${cookies.token}`,
        },
      });

      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation page
      router.push(`/orders/${order.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to process order');
    } finally {
      setProcessingPayment(false);
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

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/')}
              className="inline-block bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
            
            <div className="mb-6">
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={processingPayment}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 flex items-center justify-center disabled:opacity-50"
            >
              {processingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
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
            
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-800 mb-2">Items in Cart</h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 