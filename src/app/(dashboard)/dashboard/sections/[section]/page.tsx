import { getCollectionBySection, getCollectionsBySectionId } from "@/utils/supabase/collections";
import { NavigatorUI } from "../NavigatorUI";
import { updateCollection, updateCollectionPositions } from "@/app/(dashboard)/actions/collections";

export default async function Page({
	params
}: {
	params: Promise<{ section: string }>
}) {

	const { section: sectionSlug } = await params;
	const collections = await getCollectionBySection(sectionSlug)

	return (


		<div className="h-full w-full flex flex-col">

			<NavigatorUI
				title={sectionSlug}
				items={collections}
				type="collection"
				basePath={sectionSlug}
				onSave={updateCollectionPositions}
				onUpdateField={updateCollection}
			/>

		</div>

	);

};