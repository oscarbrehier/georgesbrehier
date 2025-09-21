import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';
import ArtworksScroll from '@/components/ArtworkScroll';

export default async function ArtworksPage() {

	const artworkDir = path.join(process.cwd(), 'public', 'artworkfill');
	let files: string[] = [];
	try {
		files = await fs.readdir(artworkDir);
	} catch (e) {
		console.error('Could not read artwork directory:', e);
	}

	const images = files.filter((f) =>
		['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase())
	).slice(0, 3);


	const basePath = "/artworkfill";

	return (
		// <HorizontalGallery2 images={images} basePath="/artworkfill"  />

		<>

			{/* <div ref={containerRef} className="h-screen w-full max-w-lg flex items-center relative">

				{images.map((image, index) => (

					<Image
						key={index}
						src={`${basePath}/${image}`}
						ref={(el) => (imageRefs.current[index] = el)}
						alt="image"
						width={800} // set width in px
						height={600} // set height in px
						className={`object-contain absolute ${index == 0 ? "visible" : "hidden"}`}
						priority={index < 3}
					/>

				))}

			</div> */}

			<ArtworksScroll
				images={images}
				basePath={basePath}
				titles={[
					"hello",
					"world",
					"!"
				]}
			/>

		</>

	);
}
