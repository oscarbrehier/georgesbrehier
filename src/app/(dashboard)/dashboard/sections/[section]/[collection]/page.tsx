import { CollectionsUI } from "./CollectionsUI";
import { getSectionTree } from "@/utils/supabase/sections";
import { notFound } from "next/navigation";

export default async function Page({
	params
}: {
	params: Promise<{ section: string }>
}) {

	const { section: sectionSlug } = await params;

	const sectionTree = await getSectionTree(sectionSlug, "slug");
	if (!sectionTree) return notFound();

	return (

		<CollectionsUI
			sectionTree={sectionTree}
		/>

	);

};