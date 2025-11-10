import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { EntityForm } from "./EntityForm";

export default async function Page({
	params
}: {
	params: Promise<{ entity: string }>
}) {

	const { entity } = await params;

	let sections, collections;

	if (entity === "collection") {

		sections = await fetchSupabase<GallerySection[]>(
			"sections"
		);

	};

	if (!sections) return ;

	return (

		<div className="text-black flex items-center justify-center flex-1">

			<EntityForm entity={entity} sections={sections} />

		</div>

	);

};