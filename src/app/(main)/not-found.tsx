import { roboto } from "@/utils/fonts";
import { Metadata } from "next";

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

		<main className="h-screen w-full pl-36 p-8 bg-background">

			<div className="w-full h-full flex items-center justify-center">

				<div className="lg:w-auto w-full flex lg:flex-row flex-col text-black lg:items-end lg:space-x-4 space-y-2">

					<h1 className={`${roboto.className} font-semibold sm:text-8xl text-6xl`}>404</h1>
					<div className={`${roboto.className} sm:text-2xl text-lg sm:leading-5 leading-6 space-y-2 pb-4`}>
						<p>Oops!</p>
						<p>The content you're looking for doesn't exist.</p>
					</div>

				</div>

			</div>

		</main>


	);

};