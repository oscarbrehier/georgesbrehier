import { getSections } from "@/utils/supabase/sections";
import { getCollectionsBySection } from "@/utils/supabase/collections";
import { UploadV2 } from "./UploadV2";

export default async function Page({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

	const params = await searchParams;
	const { section: rawSectionId, collection: rawCollectionId } = params;

	const sections = await getSections();
	if (!sections) return;

	const getSingleParam = (val: string | string[] | undefined) =>
		Array.isArray(val) ? val[0] : val ?? null;

	const sectionId = getSingleParam(rawSectionId);
	const collectionId = getSingleParam(rawCollectionId);

	let targetCollections: GalleryCollection[] | null = null;

	if (sectionId) {
		targetCollections = await getCollectionsBySection(sectionId);
	};

	return (

		<UploadV2
			sections={sections}
			target={{ sectionId, collectionId, collections: targetCollections }}
		/>

	);

};