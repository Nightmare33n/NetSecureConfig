'use client';

import { useState } from 'react';
import Gate from '../components/Gate';
export default function Home() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const findGateway = async () => {
    setLoading(true);
    setResult('Buscando gateway...');
    
    try {
      const response = await fetch('/api/gateway');
      const data = await response.text();
      setResult(data);
    } catch (error) {
      setResult('Error al buscar el gateway');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Encontrar Gateway</h1>
        <button
          onClick={findGateway}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar Gateway'}
        </button>
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            {result}
          </div>
        )}
        <Gate />
      </div>
    </main>
  );
}