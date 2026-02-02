import { getActiveCollections } from "@/utils/supabase/collections";
import { cn } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

export async function GalleryMarkup({
	items,
	sectionId,
	currentCollection,
}: {
	items: GalleryItem[];
	sectionId: string;
	currentCollection: string;
}) {

	const collections = await getActiveCollections(sectionId);

	return (

		<div id="gallery-track" className="relative w-full sm:block hidden">

			<div className="sticky top-0 h-screen flex flex-col justify-center pl-36 overflow-hidden">

				<div className="w-full h-8 flex space-x-8 mb-4">

					{collections.map((c) => (
						<Link key={c.id} href={`${c.slug}`} className={cn("cursor-pointer", c.id == currentCollection && "underline")}>
							{c.title}
						</Link>
					))}

				</div>

				<div
					id="gallery-wrapper"
					className="flex items-center pr-24 gap-10 will-change-transform"
				>

					{items.map((item, idx) => (

						<figure
							key={idx}
							className="shrink-0 panel 2xl:h-[50vh] xl:h-[55vh] h-[60vh] relative flex flex-col items-center justify-center w-auto"
						>
							
							<div
								data-itemid={item.id}
								className="relative h-[80%] w-auto transition-[width,height] ease-in-out duration-300"
								style={{ aspectRatio: `${item.image_width} / ${item.image_height}` }}
							>
								<Image
									src={item.image_url}
									alt={item.title}
									fill
									sizes="(max-height: 60vh) 50vw, 100vw"
									className="gallery-image cursor-pointer object-contain h-full w-auto"
									loading={idx < 3 ? "eager" : "lazy"}
								/>
							</div>

							<div className="w-full mt-1">
								<p className="text-neutral-500 font-extralight">{item.title}</p>
							</div>

						</figure>

					))}
				</div>

			</div>

		</div>

	);

};