/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['localhost', 'stormy-stream-28511.herokuapp.com'],
	},
	trailingSlash: true,
	async rewrites() {
		return [
			{
				source: '/api/cart/',
				destination: 'http://stormy-stream-28511.herokuapp.com/api/cart/',
			},
		];
	},
};

module.exports = nextConfig;
