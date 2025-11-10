import { supabase } from "@/lib/supabase";
import { Upload } from "./Upload"

async function getSections() {

	const { data, error } = await supabase
		.from("sections")
		.select("*");

	if (error) return null;
	return data;

};

export default async function Page() {

	const sections = await getSections();

	if (!sections) return ;
	
	return (

		<Upload sections={sections} />

	);

};