import React from "react";
import { SignOutBtn } from "./SignOutBtn";
import { createClient } from "@/utils/supabase/server";

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
					<SignOutBtn />
				)
			}
			
			{children}

		</>
		
	);

};