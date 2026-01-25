import { getNavSections, getSections } from "@/utils/supabase/sections";
import { NavigatorUI } from "./NavigatorUI";
import { updateSection, updateSectionPositions } from "../../actions/sections";
import { UI_LABELS } from "@/utils/constants";

export default async function Page() {

	const sections = await getSections();
	const activeSections = await getNavSections();

	const sectionsWithStatus = sections
		.sort((a, b) => a.position - b.position)
		.map((section) => {

			const isManuallyHidden = !section.is_visible;
			const isPubliclyActive = activeSections.some(s => s.id === section.id);

			let status: "visible" | "hidden" | "empty";

			if (isManuallyHidden) {
				status = "hidden"
			} else if (isPubliclyActive) {
				status = "visible";
			} else {
				status = "empty"
			};

			return {
				...section,
				status
			};

		});

	return (

		<div className="h-full w-full flex flex-col">

			<NavigatorUI
				title={UI_LABELS.section.capPlural}
				items={sectionsWithStatus}
				type="section"
				basePath="sections"
				onSave={updateSectionPositions}
				updateFn={updateSection}
			/>

		</div>

	);

};