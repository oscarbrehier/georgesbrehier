import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { roboto } from "@/utils/fonts";

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
	nav
}: Readonly<{
	children: React.ReactNode;
	nav?: React.ReactNode;
}>) {
	return (
		<html lang="en">

			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full bg-neutral-100`}
			>

				<header className='lg:h-screen lg:w-36 w-full p-8 fixed top-0 left-0 bg-neutral-100 z-[60] flex lg:flex-col items-center lg:justify-start justify-between'>

					<h1 className={`${roboto.className} font-semibold text-xl capitalize text-neutral-800 flex flex-col -space-y-1.5`}>
						<span>georges</span>
						<span>bréhier</span>
					</h1>

					<nav className='lg:w-full w-auto lg:mt-20'>

						{nav}

					</nav>

				</header>

				{children}

			</body>

		</html>
	);
}
