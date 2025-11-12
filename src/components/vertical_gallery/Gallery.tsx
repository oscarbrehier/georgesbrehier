import Image from "next/image";

export default async function VerticalGallery({ images }: { images: GalleryItem[] }) {

	return (

		<div className="lg:hidden flex min-h-screen h-auto w-full flex-col items-center pt-32 p-8 space-y-8 bg-neutral-100">

			{images.map((image, idx) => (

				<div key={`${image.id}-${idx}`} className="max-w-xl">

					<Image
						src={image.image_url}
						width={600}
						height={800}
						alt={image.title}
						className="w-full h-auto"
					/>

				</div>

			))}

		</div>

	);

};