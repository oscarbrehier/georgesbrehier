import { getSections } from "@/utils/supabase/sections";
import { getCollectionsBySection } from "@/utils/supabase/collections";
import { Upload } from "./Upload";

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

		<Upload
			sections={sections}
			target={{ sectionId, collectionId, collections: targetCollections }}
		/>

	);

};