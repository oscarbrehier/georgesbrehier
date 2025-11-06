import { promises as fs } from 'fs';
import path from 'path';
import InfiniteGallery from '@/components/gallery/Gallery';

export default async function ArtworksPage() {

	const artworkDir = path.join(process.cwd(), 'public', 'artworkfill');
	let files: string[] = [];

	try {
		files = await fs.readdir(artworkDir);
	} catch (e) {
		console.error('Could not read artwork directory:', e);
	};

	let images: GalleryImageItem[] = [];
	const basePath = "/artworkfill";

	files.forEach((f, idx) => {

		if (['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase())) {
			images.push({
				id: idx,
				url: `${basePath}/${f}`,
				title: `title-${idx}`
			});
		};

	});

	return (
		
		<>
			<InfiniteGallery images={images} />
		</>

	);

};
