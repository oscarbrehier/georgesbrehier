import { supabase } from "@/lib/supabase";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { Selector } from "./Selector";

const getSections = cache(async () => {

	const { error, data } = await supabase
		.from("sections")
		.select("*");



	const sections = data?.map(({ title }) => title);

	if (sections && sections.length !== 0 && !error) {
		return ["all", ...sections];
	};

	return null;

});

const getGalleryItems = cache(async (section: string) => {

	let query = supabase
		.from("works")
		.select("*");

	if (section !== "all") {
		query.eq("section", section);
	};

	const res = await query;

	return res;

});

const getCollections = cache(async (section: string | null) => {

	const data = await fetchSupabase<GalleryCollection[]>(
		"collections",
		{
			...((section && section !== "all") && { "section.slug": section })
		},
		`
			id,
			title,
			slug,
			section:sections!inner (
				id,
				slug
			)
		`
	);

	return data;

});

export default async function Page({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

	const params = await searchParams;
	let section = Array.isArray(params.section) ? params.section[0] : params.section;

	const collections = await getCollections(section ?? null);

	const sections = await getSections();

	if (!section || !sections?.includes(section)) {
		redirect(`/dashboard/gallery?section=all`, RedirectType.replace);
	};

	const { data: galleryItems, error } = await getGalleryItems(section);

	if (error || !collections) {
		return null;
	};


	return (

		<div className="flex-1 w-full space-y-4">

			{sections && (
				<Selector sections={sections} current={section} collections={collections} />
			)}

			<div className="grid grid-cols-6 gap-4 mt-12">

				{galleryItems?.map((item) => (

					<div
						key={item.id}
					>
						<img
							src={item.image_url}
						/>
					</div>

				))}

			</div>

		</div>

	);

};