import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { cache } from "react";

const getCollection = async () => {

	const data = await fetchSupabase<GalleryCollection[]>(
		"collections",
		{},
		`
			id,
			title,
			slug,
			seo_og_image_url
		`
	);

	return data;

};

export default async function Page() {

	const collections = await getCollection();
	console.log(collections)

	return (

		<div className="h-auto w-full pt-8 grid grid-cols-6 gap-4">

			{collections?.map((collection, idx) => (

				<div
					key={idx}
					style={{ backgroundImage: `url(${collection.seo_og_image_url ?? ""})` }}
					className="w-full h-96 bg-neutral-200 bg-cover bg-center flex items-end p-4"
				>
					
					<p
						className="text-black text-2xl cursor-pointer"
					>
						{collection.title}
					</p>

				</div>

			))}

		</div>

	);

};