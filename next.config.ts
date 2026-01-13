import type { NextConfig } from "next";

const nextConfig: NextConfig = {

	// logging: {

	// 	fetches: {
	// 		fullUrl: true,
	// 		hmrRefreshes: true
	// 	},

	// 	incomingRequests: {
	// 		ignore: [/\bapi\/health\b/],
	// 	}

	// },

	cacheComponents: true,

	async headers() {
		return [
			{
				source: '/dashboard/:path*',
				headers: [
					{
						key: 'X-Robots-Tag',
						value: 'noindex, nofollow, noarchive, nosnippet',
					},
				],
			}
		];
	},

	images: {
		qualities: [25, 50, 75, 85],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "wqcpryhdynoyeylgnnza.supabase.co",
				port: "",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/**"
			}
		],
	},

	experimental: {
		typedEnv: true
	},

};

export default nextConfig;
