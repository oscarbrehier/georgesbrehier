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

	// return (

	// 	<div className="h-screen flex flex-col justify-center pl-36 hide-scrollbar" >

	// 		<div className="w-full h-8 flex space-x-8 mb-4">

	// 			{collections.map((c) => (

	// 				<Link
	// 					key={c.id}
	// 					href={`${c.slug}`}
	// 					className={cn(
	// 						"cursor-pointer",
	// 						c.id == currentCollection && "underline"
	// 					)}					
	// 				>
	// 					{c.title}
	// 				</Link>

	// 			))}

	// 		</div>

	// 		<div className={`h-auto lg:flex items-center hidden pr-24 gap-10`}  id="gallery-wrapper">

	// 			{items.map((item, idx) => (

	// 				<figure
	// 					key={`gallery-${item.title}-${idx}`}
	// 					className="panel 2xl:h-[50vh] xl:h-[55vh] h-[60vh] relative flex flex-col items-center justify-center shrink-0 w-auto"
	// 				>

	// 					<div
	// 						data-itemid={item.id}
	// 						className="relative h-[80%] w-auto will-change-[width,height]"
	// 						style={{ transition: 'width 0.3s ease, height 0.3s ease' }}
	// 					>

	// 						<Image
	// 							src={item.image_url}
	// 							alt={item.description || item.title}
	// 							width={800}
	// 							height={600}
	// 							className="gallery-image cursor-pointer object-contain h-full w-auto"
	// 							loading={idx < 3 ? "eager" : "lazy"}
	// 						/>

	// 					</div>

	// 					{item.title && (
	// 						<figcaption className="sr-only">{item.title}</figcaption>
	// 					)}

	// 					<div className="w-full mt-1">
	// 						<p className="text-neutral-500 font-extralight">{item.title}</p>
	// 					</div>

	// 				</figure>

	// 			))}

	// 		</div>

	// 	</div>

	// );

	return (
		/* The Track: Its height will be set dynamically by GSAP */
		<div id="gallery-track" className="relative w-full">

			<div className="sticky top-0 h-screen flex flex-col justify-center pl-36 overflow-hidden">

				{/* ... Collections Links ... */}
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
							style={{ aspectRatio: `${item.image_width} / ${item.image_height}` }}
							className="shrink-0 panel 2xl:h-[50vh] xl:h-[55vh] h-[60vh] relative flex flex-col items-center justify-center w-auto"
						>
							<div data-itemid={item.id} className="relative h-[80%] w-auto transition-[width,height] duration-300">
								<Image
									src={item.image_url}
									alt={item.title}
									width={800} height={600}
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