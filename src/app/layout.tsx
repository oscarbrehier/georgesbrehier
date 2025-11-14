import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { baseSeo, getBaseUrl } from "@/utils/seo";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

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
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full bg-neutral-100`}
			>

				{children}
			</body>
		</html>

	);

};