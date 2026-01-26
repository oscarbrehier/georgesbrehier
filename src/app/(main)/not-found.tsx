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

		<main className="w-full h-screen flex flex-col items-center justify-center p-8">

			<div className="flex flex-col items-center justify-center max-w-md">

				<h1 className="font-medium text-4xl mb-2 text-center text-neutral-900">
					404 - Page not found
				</h1>

				<p className="mb-12 text-center text-neutral-600">
					The path you requested does not exist or has been moved.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">

					<a
						href="/"
						className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 transition-all ease-in-out duration-300 text-white px-6 py-2"
					>
						Go to gallery
					</a>

				</div>

			</div>

		</main>


	);

};