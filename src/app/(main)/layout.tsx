import { Suspense } from "react";
import "../globals.css";
import { roboto } from "@/utils/fonts";

export default function Layout({
	children,
	nav
}: Readonly<{
	children: React.ReactNode;
	nav?: React.ReactNode;
}>) {

	return (
		<>

			<header className='lg:h-screen lg:w-36 w-full p-8 fixed top-0 left-0 bg-neutral-100 z-[60] flex lg:flex-col items-center lg:justify-start justify-between'>

				<h1 className={`${roboto.className} font-semibold text-xl capitalize text-neutral-800 flex flex-col -space-y-1.5`}>
					<span>georges</span>
					<span>bréhier</span>
				</h1>

				<nav className='lg:w-full w-auto lg:mt-20'>

					{nav}

				</nav>

			</header>

			<Suspense>
				{children}
			</Suspense>

		</>

	);

};
