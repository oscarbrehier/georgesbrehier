import Image from "next/image";

export function GalleryMarkup({
	items
}: {
	items: GalleryItem[]
}) {

	return (

		<div className={`h-screen lg:flex items-center hidden hide-scrollbar ml-36 pr-24 gap-10 `} id="gallery-container">

			{items.map((item, idx) => (

				<figure
					key={`gallery-${item.title}-${idx}`}
					className="panel 2xl:h-[50vh] xl:h-[55vh] h-[60vh] relative flex items-center justify-center shrink-0 w-auto"
				>

					<div
						data-itemid={item.id}
						className="relative h-[80%] w-auto transition-all ease-in-out duration-300"
					>

						<Image
							src={item.image_url}
							alt={item.description || item.title}
							width={800}
							height={600}
							className="gallery-image cursor-pointer object-contain h-full w-auto"
							loading={idx < 3 ? "eager" : "lazy"}
						/>

					</div>

					{item.title && (
						<figcaption className="sr-only">{item.title}</figcaption>
					)}

				</figure>

			))}

		</div>

	);

};