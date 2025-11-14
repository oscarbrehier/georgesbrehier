import { MetadataRoute } from "next";
import { getBaseUrl } from "@/utils/seo";

export default function robots(): MetadataRoute.Robots {

	const url = getBaseUrl();

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/dashboard", "/dashboard/*"]
		},
		sitemap: url ? `${url}/sitemap.xml` : undefined
	};

};