import Image from "next/image";

export function GalleryMarkup({
	items
}: {
	items: GalleryItem[]
}) {

	return (

		<div className={`lg:flex hidden hide-scrollbar ml-36 pr-24`} id="gallery-container">

			{items.map((item, idx) => (

				<figure
					key={`gallery-${item.title}-${idx}`}
					className="panel h-screen 2xl:w-[30vw] xl:w-[40vw] w-[50vw] relative flex items-center justify-center shrink-0"
				>

					<div
						data-itemid={item.id}
						className="relative transition-all duration-75 ease-in-out w-3/4 h-[80%]"
					>
						<Image
							src={item.image_url}
							alt={item.description || item.title}
							fill
							className="gallery-image cursor-pointer object-contain"
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