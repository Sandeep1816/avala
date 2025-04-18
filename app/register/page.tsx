'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      mobile: formData.get('mobile'),
      email: formData.get('email') || undefined,
      password: formData.get('password'),
      address: formData.get('address'),
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      // Show success message
      toast.success('Registration successful! Welcome to Mango E-commerce.');

      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="py-4 px-6 bg-orange-600 text-white text-center">
          <h2 className="text-2xl font-bold">Create an Account</h2>
        </div>
        <div className="py-8 px-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your mobile number"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Delivery Address</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your delivery address"
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition duration-300 disabled:bg-orange-400"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 