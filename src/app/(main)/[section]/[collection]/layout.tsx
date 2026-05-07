import { createClient } from "@/utils/supabase/server";
import { DashboardButton } from "./DashboardButton";

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {

	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	return (
		<>
			{children}
			{user && <DashboardButton />}
		</>
	);

};