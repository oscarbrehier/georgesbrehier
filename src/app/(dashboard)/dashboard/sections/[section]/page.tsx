import { getCollectionBySection, getCollectionsBySectionId } from "@/utils/supabase/collections";
import { NavigatorUI } from "../NavigatorUI";
import { updateSection, updateSectionPositions } from "@/app/(dashboard)/actions/sections";

export default async function Page({
	params
}: {
	params: Promise<{ section: string }>
}) {

	const { section: sectionSlug } = await params;
	const collections = await getCollectionBySection(sectionSlug)

	console.log(collections)

	return (


		<div className="h-full w-full flex flex-col">

			<NavigatorUI
				title={sectionSlug}
				items={collections}
				basePath={sectionSlug}
				onSave={updateSectionPositions}
				onUpdateField={updateSection}
			/>

		</div>

	);

};