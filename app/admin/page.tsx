import React from 'react';
import Link from 'next/link';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaPlus } from 'react-icons/fa';

export default function AdminDashboard() {
  // Mock data - replace with actual data from your database
  const stats = {
    totalProducts: 12,
    totalOrders: 45,
    totalCustomers: 89,
    totalRevenue: 12500,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Link
          href="/admin/products/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FaBox className="text-2xl text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Products</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaShoppingCart className="text-2xl text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaUsers className="text-2xl text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Customers</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaDollarSign className="text-2xl text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Products</h3>
          <p className="text-gray-600 mb-4">
            Add, edit, or remove products from your inventory.
          </p>
          <div className="flex items-center text-green-600">
            <span>View Products</span>
            <FaBox className="ml-2" />
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Orders</h3>
          <p className="text-gray-600 mb-4">
            View and process customer orders.
          </p>
          <div className="flex items-center text-green-600">
            <span>View Orders</span>
            <FaShoppingCart className="ml-2" />
          </div>
        </Link>

        <Link
          href="/admin/customers"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Customers</h3>
          <p className="text-gray-600 mb-4">
            View customer information and order history.
          </p>
          <div className="flex items-center text-green-600">
            <span>View Customers</span>
            <FaUsers className="ml-2" />
          </div>
        </Link>
      </div>
    </div>
  );
} 