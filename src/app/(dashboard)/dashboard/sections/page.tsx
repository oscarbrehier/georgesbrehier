import { getSections } from "@/utils/supabase/sections";
import { NavigatorUI } from "./NavigatorUI";
import { updateSection, updateSectionPositions } from "../../actions/sections";
import { UI_LABELS } from "@/utils/constants";

export default async function Page() {

	const sections = await getSections();

	return (

		<div className="h-full w-full flex flex-col">

			<NavigatorUI
				title={UI_LABELS.section.capPlural}
				items={sections}
				type="section"
				basePath="sections"
				onSave={updateSectionPositions}
				updateFn={updateSection}
			/>

		</div>

	);

};