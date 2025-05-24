'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting to Supabase...');
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test connection by fetching tables
        const { data, error } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');

        if (error) throw error;

        if (data) {
          setTables(data.map((item: any) => item.tablename));
          setConnectionStatus('✅ Successfully connected to Supabase!');
        }
      } catch (err) {
        console.error('Connection error:', err);
        setError(`Failed to connect to Supabase: ${err.message}`);
        setConnectionStatus('❌ Connection failed');
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Connection Status:</h2>
          <p className={error ? 'text-red-600' : 'text-green-600'}>
            {isLoading ? 'Testing connection...' : connectionStatus}
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-50 text-red-700 rounded text-sm">
              <p className="font-medium">Error details:</p>
              <pre className="mt-1 overflow-auto p-2 bg-white rounded">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Environment Variables:</h2>
          <div className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            <pre>
              {`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}`}
            </pre>
          </div>
        </div>

        {tables.length > 0 && (
          <div>
            <h2 className="font-semibold mb-2">Tables in Database:</h2>
            <ul className="list-disc pl-5 space-y-1">
              {tables.map((table) => (
                <li key={table} className="font-mono">{table}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded text-sm">
          <p className="font-medium text-blue-800">Next Steps:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>If you see tables listed above, your connection is working!</li>
            <li>If you see an error, check your environment variables</li>
            <li>Make sure your Supabase project has the correct CORS settings</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
