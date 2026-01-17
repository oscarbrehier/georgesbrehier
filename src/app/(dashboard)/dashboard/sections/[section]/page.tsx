import { NavigatorUI } from "../NavigatorUI";
import { updateCollection, updateCollectionPositions } from "@/app/(dashboard)/actions/collections";
import { getCollectionsBySection } from "@/utils/supabase/collections";
import { getSectionId } from "@/utils/supabase/sections";
import { notFound } from "next/navigation";

export default async function Page({
	params
}: {
	params: Promise<{ section: string }>
}) {

	const { section: sectionSlug } = await params;

	const sectionId = await getSectionId(sectionSlug);
	if (!sectionId) return notFound();

	const collections = await getCollectionsBySection(sectionId)

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