import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import Link from "next/link";
import { cache } from "react";

const getCollection = cache(async () => {

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

});

export default async function Page() {

	const collections = await getCollection();

	return (

		<div className="h-auto w-full pt-8 grid grid-cols-6 gap-4">
			{collections?.map((collection, idx) => (

				<Link
					key={idx}
					href={`seo/${collection.slug}`}
					style={{ backgroundImage: `url(${collection.seo_og_image_url ?? ""})` }}
					className="w-full h-96 bg-neutral-200 bg-cover bg-center flex items-end p-4"
				>

					<p
						className="text-black text-2xl cursor-pointer"
					>
						{collection.title}
					</p>

				</Link>

			))}
		</div>

	);

};