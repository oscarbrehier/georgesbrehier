import Image from "next/image";

export default async function VerticalGallery({ images }: { images: GalleryItem[] }) {

	return (

		<div className="lg:hidden flex min-h-screen h-auto w-full flex-col items-center pt-32 p-8 space-y-8 bg-neutral-100">

			{images.map((image, idx) => (

				<figure
					key={`${image.id}-${idx}`}
					className="max-w-xl"
				>

					<Image
						src={image.image_url}
						alt={image.title}
						width={600}
						height={800}
						className="w-full h-auto"
						loading={idx < 3 ? "eager" : "lazy"}
					/>

					{image.title && (
						<figcaption className="text-black mt-1 sr-only">{image.title}</figcaption>
					)}

				</figure>

			))}

		</div>

	);

};