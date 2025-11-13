import React, { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: {
			index: false,
			follow: false
		}
	}
};

export default function Layout({
	children
}: {
	children: React.ReactNode
}) {

	return (

		<>
			<Suspense>
				{children}
			</Suspense>
		</>

	);

};