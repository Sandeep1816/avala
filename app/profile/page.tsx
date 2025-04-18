'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
  });

  useEffect(() => {
    if (!cookies.token) {
      router.push('/login');
      return;
    }
    fetchUserProfile();
    fetchOrders();
  }, [cookies.token, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${cookies.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        address: data.address || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      toast.error(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${cookies.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load orders');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    removeCookie('token', { path: '/' });
    router.push('/login');
    toast.success('Logged out successfully!');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">My Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'profile'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'orders'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            My Orders
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Mobile</h3>
                  <p className="mt-1 text-lg text-gray-900">{user?.mobile}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 text-lg text-gray-900">{user?.address || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">You haven't placed any orders yet.</p>
                <button
                  onClick={() => router.push('/products')}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-gray-500">
                              {item.quantity} x ₹{item.price}
                            </p>
                          </div>
                          <p className="font-medium">₹{item.quantity * item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-semibold">₹{order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 