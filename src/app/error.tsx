'use client'

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unexpected Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
        
        <div className="mb-4 bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Error Message:</strong> {error.message}
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500">
              <strong>Error Digest:</strong> {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => reset()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Return to Home
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>If the problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  )
}