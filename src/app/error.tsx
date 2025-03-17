'use client'

import { useEffect } from 'react';

export default function Error({
	error}: {
	error: Error & { digest?: string }
	reset: () => void}) {
	useEffect(() => {
		console.error('Unexpected Error:', error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md w-full">
				<div className="mb-4 bg-gray-50 p-4 rounded-md">
					<p className="text-sm text-gray-700 mb-2">
						<strong>Error:</strong> {error.message}
					</p>
				</div>
			</div>
		</div>
	)
}