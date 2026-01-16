import { getSections } from "@/utils/supabase/sections";
import { NavigatorUI } from "./NavigatorUI";
import { updateSection, updateSectionPositions } from "../../actions/sections";

export default async function Page() {

	const sections = await getSections();

	return (

		<div className="h-full w-full flex flex-col">

			<NavigatorUI
				title="Sections"
				items={sections}
				basePath="sections"
				onSave={updateSectionPositions}
				onUpdateField={updateSection}
			/>

		</div>

	);

};