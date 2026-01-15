import { getSections } from "@/utils/supabase/sections";
import { SectionsUI } from "./SectionsUI";

export default async function Page() {

	const sections = await getSections();

	return (

		<div className="h-full w-full flex flex-col">

			<SectionsUI sections={sections} />

		</div>

	);

};