import { use } from "react";
import { Upload } from "./Upload";
import { getSections } from "@/utils/supabase/sections";

export default async function Page({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

	const params = await searchParams;
	const { sectionId, collectionId } = params;

	const sections = await getSections();
	if (!sections) return;

	const getSingleParam = (val: string | string[] | undefined) =>
		Array.isArray(val) ? val[0] : val ?? null;

	return (

		<Upload
			sections={sections}
			target={{ sectionId: getSingleParam(sectionId), collectionId: getSingleParam(collectionId) }}
		/>

	);

};