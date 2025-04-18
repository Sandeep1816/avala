'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        price: parseFloat(formData.get('price') as string),
        stock: parseInt(formData.get('stock') as string),
        shortDesc: formData.get('shortDesc'),
        description: formData.get('description'),
        image: formData.get('image') as string,
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/admin/products" className="text-green-600 hover:text-green-800 mr-4">
          ← Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-green-800">Add New Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="e.g. Alphonso Mango"
                required
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                Price (₹ per kg)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="e.g. 450"
                min="1"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label htmlFor="stock" className="block text-gray-700 font-medium mb-2">
                Stock (kg)
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="e.g. 50"
                min="0"
                required
              />
            </div>
            
            <div>
              <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                Product Image URL
              </label>
              <input
                type="text"
                id="image"
                name="image"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter image URL"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="shortDesc" className="block text-gray-700 font-medium mb-2">
                Short Description
              </label>
              <input
                type="text"
                id="shortDesc"
                name="shortDesc"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Brief description of the product"
                maxLength={100}
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Full Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Detailed description of the product"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 