import { Upload } from "./Upload";
import { getSections } from "@/utils/supabase/sections";

export default async function Page() {

	const sections = await getSections();
	if (!sections) return ;
	
	return (

		<Upload sections={sections} />

	);

};