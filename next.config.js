/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['localhost'],
	},
	trailingSlash: true,
	async rewrites() {
		return [
			{
				source: '/api/cart/',
				destination: 'http://localhost:8000/api/cart/',
			},
		];
	},
};

module.exports = nextConfig;
