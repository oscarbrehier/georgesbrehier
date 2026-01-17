import { roboto } from "@/utils/fonts";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "404 - Page Not Found | Georges Bréhier",
	description: "The page you are looking for could not be found.",
	robots: {
		index: false,
		follow: true
	}
};

export default function NotFound() {

	return (

		<main className="h-screen w-full p-8 bg-background">

			<div className="w-full h-full flex flex-col items-center justify-center">

				<h1 className={`${roboto.className} font-medium text-4xl mb-2 text-center`}>404 - Page not found</h1>
				<p className="mb-12 text-center">The path you requested does not exist or has been moved.</p>

				<div className="space-x-2 w">

					<Link
						href="/"
						className="bg-neutral-800 hover:bg-neutral-700  transition-all ease-in-out duration-300 text-background px-4 py-2"
					>
						Go to gallery
					</Link>

				</div>

			</div>

		</main>


	);

};