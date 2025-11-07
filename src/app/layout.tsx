import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const name = "Georges Bréhier";
const description = "";
const url = "";

export const metadata: Metadata = {
	title: name,
	description: description,
	authors: [{ name }],
	openGraph: {
		title: name,
		description,
		url,
		siteName: `${name} Portfolio`,
		images: [
			{
				url: '',
				width: 0,
				height: 0
			}
		],
		locale: "en_EN",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: `${name} - Portfolio`,
		description,
		images: []
	}
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">

			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-auto w-full bg-neutral-100`}
			>

					{children}

			</body>

		</html>
	);
}
