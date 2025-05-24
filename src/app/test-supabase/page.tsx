'use client';

import { useEffect, useState } from 'react';

type ApiResponse = {
  success: boolean;
  session: string;
  feedbackCount: number;
  error?: string;
  environment: {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  };
};

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting to Supabase...');
  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testFeedback, setTestFeedback] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test connection by calling our API endpoint
        const response = await fetch('/api/test-supabase');
        const data: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to connect to API');
        }

        setFeedbackCount(data.feedbackCount);
        setConnectionStatus(`✅ ${data.session}`);
        
      } catch (err: any) {
        console.error('Connection error:', err);
        setError(`Failed to connect: ${err?.message || 'Unknown error'}`);
        setConnectionStatus('❌ Connection failed');
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  const handleTestFeedback = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const testData = {
        message_id: `test-${Date.now()}`,
        is_positive: true,
        feedback_text: 'This is a test feedback',
        message_content: 'Test message content',
        message_metadata: {
          message_type: 'test',
          tone: 'neutral',
          test_run: true
        },
        formatting_analysis: [
          {
            format_type: 'test',
            position_start: 0,
            position_end: 4,
            content: 'Test',
            context_category: 'test'
          }
        ]
      };

      console.log('Sending test data:', testData);
      
      const response = await fetch('/api/test-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      console.log('API Response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      setTestFeedback(result);
      setConnectionStatus('✅ Feedback submitted successfully!');
      
      // Refresh feedback count
      const countResponse = await fetch('/api/test-supabase');
      const countData = await countResponse.json();
      if (countData.success) {
        setFeedbackCount(countData.feedbackCount);
      }
      
    } catch (err: any) {
      console.error('Feedback error:', err);
      const errorMessage = err?.message || 'Unknown error';
      console.error('Full error:', err);
      setError(`Failed to submit feedback: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">WhatsAppifiyer Feedback System</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Database Status:</h2>
          <p className={error ? 'text-red-600' : 'text-green-600'}>
            {isLoading ? 'Testing connection...' : connectionStatus}
          </p>
          {!isLoading && !error && (
            <p className="mt-2">Feedback entries: {feedbackCount}</p>
          )}
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

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Test Feedback</h2>
          <button
            onClick={handleTestFeedback}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Test Feedback'}
          </button>
          
          {testFeedback && (
            <div className="mt-4 p-4 bg-green-50 text-green-800 rounded border border-green-200">
              <h3 className="font-semibold">Test Feedback Sent Successfully!</h3>
              <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded">
                {JSON.stringify(testFeedback, null, 2)}
              </pre>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-800 rounded border border-red-200">
              <h3 className="font-semibold">Error Details:</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded text-sm">
          <p className="font-medium text-blue-800">Next Steps:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Click the button above to send test feedback</li>
            <li>Check your Supabase dashboard to see the saved feedback</li>
            <li>If you see an error, check your browser's console for more details</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
