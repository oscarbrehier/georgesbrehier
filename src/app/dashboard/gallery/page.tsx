import { supabase } from "@/lib/supabase";
import { SectionSelector } from "./SectionSelector";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";

const getSections = cache(async () => {

	const { error, data } = await supabase
		.from("works")
		.select("section");

	const sections = data?.map(({ section }) => section);

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

export default async function Page({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

	const params = await searchParams;
	let section = Array.isArray(params.section) ? params.section[0] : params.section;

	const sections = await getSections();

	if (!section || !sections?.includes(section)) {
		redirect(`/dashboard/gallery?section=all`, RedirectType.replace);
	};

	const { data: galleryItems, error } = await getGalleryItems(section);

	if (error) {
		return null;
	};

	return (

		<div className="flex-1 w-full space-y-4">

			{sections && (
				<SectionSelector sections={sections} current={section} />
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

// {
//   error: null,
//   data: [
//     {
//       id: 2,
//       title: 'test',
//       description: 'test1',
//       image_url: 'https://wqcpryhdynoyeylgnnza.supabase.co/storage/v1/object/public/gallery_images/1762444194262-Rolling_Stones_1965.jpg',
//       created_at: '2025-11-06T15:50:02.206931+00:00',
//       section: 'sculptures'
//     }
//   ],
//   count: null,
//   status: 200,
//   statusText: 'OK'
// }