import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {

	const url = '';

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/dashboard", "/dashboard/*"]
		},
		sitemap: `${url}/sitemap.xml`
	};

};