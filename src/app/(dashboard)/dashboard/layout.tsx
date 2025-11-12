import React, { Suspense } from "react";
import { HelperModal } from "./HelperModal";
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

async function HelperModalWrapper() {

	const { createClient } = await import("@/utils/supabase/server");
	const supabase = await createClient();
	const { data } = await supabase.auth.getUser();

	if (!data.user) return null;


	return <HelperModal />;

};

export default function Layout({
	children
}: {
	children: React.ReactNode
}) {

	return (

		<>

			<Suspense fallback={null}>
				<HelperModalWrapper />
			</Suspense>

			<Suspense>
				{children}
			</Suspense>

		</>

	);

};