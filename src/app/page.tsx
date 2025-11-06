import HorizontalGallery from '@/components/horizontal_gallery/Gallery';
import { VerticalGallery } from '@/components/vertical_gallery/Gallery';
import { bodoni, roboto } from '@/utils/fonts';
import { promises as fs } from 'fs';
import path from 'path';

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
			<div className='h-32 w-full px-8 flex flex-col justify-center fixed top-0 left-0 lg:bg-transparent bg-foreground w pb-2 -space-y-1.5 z-[60]'>
				<p className={`${roboto.className} font-semibold text-xl capitalize text-neutral-800`}>georges</p>
				<p className={`${roboto.className} font-semibold text-xl capitalize text-neutral-800`}>bréhier</p>
			</div>

			<HorizontalGallery images={images} />
			<VerticalGallery images={images} />
		</>

	);

};
