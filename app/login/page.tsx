'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { useCookies } from 'react-cookie';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['token']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      mobile: formData.get('mobile'),
      password: formData.get('password'),
    };

    try {
      console.log('Attempting login with:', data);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('Login response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Login failed');
      }

      // Set the token in cookies
      setCookie('token', responseData.token, {
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        sameSite: 'lax',
      });

      // Show success message
      toast.success('Login successful!');

      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="py-4 px-6 bg-green-700 text-white text-center">
          <h2 className="text-2xl font-bold">Login</h2>
        </div>
        <div className="py-8 px-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="mobile" className="block text-gray-700 font-medium mb-2">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter your mobile number"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-green-400"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-green-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 