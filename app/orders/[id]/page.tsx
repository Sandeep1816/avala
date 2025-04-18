'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { FaCheckCircle } from 'react-icons/fa';

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

interface Order {
  id: string;
  items: OrderItem[];
  shipping: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: string;
  };
  summary: {
    subtotal: number;
    gst: number;
    shipping: number;
    total: number;
  };
  status: string;
  createdAt: string;
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [cookies] = useCookies(['token']);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!cookies.token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/orders/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${cookies.token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [cookies.token, params.id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Order not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>
            <p className="text-gray-600 mt-2">Thank you for your purchase</p>
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order ID</p>
                <p className="font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium text-green-600">{order.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium capitalize">{order.shipping.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Shipping Information</h2>
            <div className="text-sm">
              <p className="font-medium">{order.shipping.name}</p>
              <p className="text-gray-600">{order.shipping.address}</p>
              <p className="text-gray-600">
                {order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}
              </p>
              <p className="text-gray-600">Phone: {order.shipping.phone}</p>
              <p className="text-gray-600">Email: {order.shipping.email}</p>
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{item.product.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.summary.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span>₹{order.summary.gst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{order.summary.shipping === 0 ? 'Free' : `₹${order.summary.shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-600">₹{order.summary.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
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