import type { NextConfig } from "next";

const nextConfig: NextConfig = {
//   make it standalone
  output: "standalone",
  async rewrites() {
		return [
			{
				source: '/api/v1/:path*',
				destination: `${process.env.NGINX_URL}/api/v1/:path*`,
			},
		]
	},
};

export default nextConfig;
