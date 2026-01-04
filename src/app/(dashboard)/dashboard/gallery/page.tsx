import { supabase } from "@/lib/supabase";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { Selector } from "./Selector";
import { cn } from "@/utils/utils";
import { roboto } from "@/utils/fonts";
import { GalleryItem } from "./GalleryItem";
import { GalleryToolbar } from "./Toolbar";

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

		<div className="h-[calc(100vh-104px)] w-full flex">

			<div className="h-full w-44">
				{(sections && collections) && (
					<Selector sections={sections} current={section} collections={collections} />
				)}
			</div>

			<div className="h-full w-full overflow-y-scroll">

				{collections?.map((collection, idx) => {

					const items = groupedGalleryItems[collection.slug];
					if (!items) return null;


					return (

						<section key={collection.slug} id={collection.slug} className={cn("space-y-2", idx !== 0 && "mt-8")}>

							<h2
								className={cn(
									"text-5xl text-black bg-neutral-100 py-2",
									roboto.className
								)}
							>
								{collection.title}
							</h2>

							<div className="grid grid-cols-6 gap-4">

								{items.map((item) => (

									<GalleryItem
										key={item.id}
										item={item}
									/>

								))}

							</div>

						</section>

					);
				})}


			</div>

		</div>

	);

};