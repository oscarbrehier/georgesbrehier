import React from "react";
import { HelperModal } from "./HelperModal";
import { createClient } from "@/utils/supabase/server";
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

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {

	const supabase = await createClient();
	const { data } = await supabase.auth.getUser();

	return (

		<>

			{
				data.user && (
					<HelperModal />
				)
			}
			
			{children}

		</>
		
	);

};