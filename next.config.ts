import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.resolve.alias['@'] = path.resolve(__dirname);
		config.resolve.alias['components'] = path.resolve(__dirname, 'components');
		return config;
	},

	typescript: {
		ignoreBuildErrors: true
	},

	images: {
		domains: [
			'fedskillstest.ct.digital',
			'fedskillstest.coalitiontechnologies.workers.dev',
			'localhost',
			'127.0.0.1'
		]
	},

	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: '/api/:path*',
			},
		];
	},

	experimental: {
		serverActions: {
			allowedOrigins: ['localhost:3000']
		}
	},
	serverExternalPackages: ['node-fetch']
};

export default nextConfig;