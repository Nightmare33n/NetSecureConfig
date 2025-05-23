'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [defaultGateway, setDefaultGateway] = useState('');
  const [routerPassword, setRouterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [router]);

  const getDefaultGateway = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-gateway');
      const data = await response.json();
      if (data.gateway) {
        setDefaultGateway(data.gateway);
        setMessage('Default gateway found!');
      } else {
        setMessage('Could not find default gateway');
      }
    } catch (error) {
      setMessage('Error getting default gateway');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/configure-router', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gateway: defaultGateway,
          password: routerPassword,
        }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error configuring router');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Router Configuration</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Get Default Gateway</h2>
          <button
            onClick={getDefaultGateway}
            disabled={loading}
            className="btn btn-primary mb-4"
          >
            {loading ? 'Loading...' : 'Get Default Gateway'}
          </button>
          {defaultGateway && (
            <p className="text-gray-600">
              Default Gateway: <span className="font-mono">{defaultGateway}</span>
            </p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Configure Router</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Router Password
              </label>
              <input
                type="password"
                id="password"
                value={routerPassword}
                onChange={(e) => setRouterPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !defaultGateway}
              className="btn btn-primary"
            >
              {loading ? 'Configuring...' : 'Configure Router'}
            </button>
          </form>
        </div>

        {message && (
          <div className="mt-4 p-4 rounded-md bg-blue-50">
            <p className="text-blue-700">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
