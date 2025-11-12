import type { NextConfig } from "next";

const nextConfig: NextConfig = {

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
		remotePatterns: [
			{
				protocol: "https",
				hostname: "wqcpryhdynoyeylgnnza.supabase.co",
				port: "",
				pathname: "/**"
			}
		]
	},

	experimental: {
		typedEnv: true
	},

};

export default nextConfig;
