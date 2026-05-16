import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Inter, Montserrat, EB_Garamond  } from "next/font/google";
import "./globals.css";

import { baseSeo, getBaseUrl } from "@/utils/seo";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/utils/utils";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-tenor",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const ortica = localFont({
	src: [
		{
			path: "./fonts/OrticaLinear-Light.woff",
			weight: "300",
			style: "normal"
		}
	],
	variable: "--font-ortica",
	display: "swap"
})

const name = baseSeo.name;
const description = baseSeo.description;
const url = getBaseUrl();

export const metadata: Metadata = {
	metadataBase: url ? new URL(url) : undefined,
	title: {
		default: name,
		template: `%s | ${name}`
	},
	description: description,
	authors: [{ name }],
	creator: name,
	publisher: name,
	openGraph: {
		title: name,
		description,
		url,
		siteName: `${name} Portfolio`,
		locale: "en_US",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: name,
		description
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		}
	},
	verification: {
		// google: 'code',
	}
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {

	return (

		<html lang="en">

			<body
				className={cn(
					"font-sans antialiased min-h-screen w-full bg-background",
					inter.variable, montserrat.variable, ebGaramond.variable, ortica.variable
				)}
			>
				{children}
				<Toaster />
			</body>

		</html>

	);

};