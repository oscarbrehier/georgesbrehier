"use client";

import { roboto } from "@/utils/fonts";
import "@/app/globals.css";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
  }) {

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

	return (

		<html lang="en">

			<body className={`${roboto.className} h-screen w-full bg-background`}>

				<main className="w-full h-full flex flex-col items-center justify-center p-8">

					<div className="flex flex-col items-center justify-center max-w-md">

						<h1 className="font-medium text-4xl mb-2 text-center text-neutral-900">
							Something went wrong
						</h1>

						<p className="mb-12 text-center text-neutral-600">
							An unexpected system error occurred. We have been notified and are looking into it.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">

							<button
								onClick={() => reset()}
								className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 transition-all ease-in-out duration-300 text-white px-6 py-2"
							>
								Try again
							</button>

							<a
								href="/"
								className="w-full sm:w-auto border border-neutral-300 hover:bg-neutral-100 transition-all ease-in-out duration-300 text-neutral-800 px-6 py-2 text-center"
							>
								Return to home
							</a>

						</div>

						{error.digest && (
							<p className="mt-8 text-[10px] uppercase tracking-widest text-neutral-400">
								Error ID: {error.digest}
							</p>
						)}

					</div>

				</main>

			</body>

		</html>

	);

};