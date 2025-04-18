'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBox, FaShoppingCart, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Products Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <FaBox className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <FaShoppingCart className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <FaUsers className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                <FaMoneyBillWave className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/products/add')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add New Product
            </button>
            <button
              onClick={() => router.push('/admin/products')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Manage Products
            </button>
            <button
              onClick={() => router.push('/admin/orders')}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              View Orders
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 