import { supabase } from "@/lib/supabase";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { Selector } from "./Selector";
import { cn } from "@/utils/utils";
import { roboto } from "@/utils/fonts";

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

const getGalleryItems = cache(
	async (section: string): Promise<GalleryItemWithCollection[] | null> => {

		let query = supabase
			.from("works")
			.select(`
			id,
			image_url,
			collection:collections!inner (
				id,
				slug,
				title,
				section:sections!inner (
					id,
					slug
				)
			)	
		`)

		if (section !== "all") {
			query.eq("collection.section.slug", section);
		};

		const { error, data } = await query.returns<GalleryItemWithCollection[]>();
		if (error || !data || data.length === 0) return null;

		return data;

	});

const getCollections = cache(async (section: string | null) => {

	const filter = (section && section !== "all") ? { "sections.slug": section } : {};

	const data = await fetchSupabase<GalleryCollection[]>(
		"collections",
		filter,
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

	const galleryItems = await getGalleryItems(section);

	if (!galleryItems) {
		return null;
	};

	const groupedGalleryItems = galleryItems.reduce<Record<string, GalleryItemWithCollection[]>>((acc, item) => {

		const slug = item.collection.slug;
		(acc[slug] ||= []).push(item);
		return acc;

	}, {});

	return (

		<div className="h-auto min-h-screen w-full">

			{(sections && collections) && (
				<Selector sections={sections} current={section} collections={collections} />
			)}

			<div className="pl-44 flex flex-col space-y-8 mt-4">

				{collections?.map((collection) => {

					const items = groupedGalleryItems[collection.slug];
					if (!items) return null;


					return (

						<section key={collection.slug} id={collection.slug} className="space-y-2 pt-4">

							<h2
								className={cn(
									"text-5xl text-black sticky top-10 bg-neutral-100 py-2",
									roboto.className
								)}
							>
								{collection.title}
							</h2>

							<div className="grid grid-cols-6 gap-4">

								{items.map((item) => (

									<div
										key={item.id}
										className="bg-neutral-200 flex items-center"
									>

										<img src={item.image_url} />

									</div>

								))}

							</div>

						</section>

					);
				})}

			</div>

		</div>

	);

};