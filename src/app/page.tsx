import HorizontalGallery from '@/components/horizontal_gallery/Gallery';
import { VerticalGallery } from '@/components/vertical_gallery/Gallery';
import { roboto } from '@/utils/fonts';
import { promises as fs } from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { getGalleryItemIds, getGalleryItems } from '@/utils/supabase/getGalleryItems';

export const metadata: Metadata = {

};

function selectInitialGalleryIds(ids: number[], currentIndex?: number): number[] {

	if (!ids || ids.length === 0) return [];

	const fetchSet = new Set<number>();

	for (let i = 0; i < Math.min(3, ids.length); i++) {
		fetchSet.add(ids[i]);
	};

	fetchSet.add(ids[ids.length - 1]);
	
	if (ids.length > 1) fetchSet.add(ids[ids.length - 2]);

	if (currentIndex === undefined) {
		return Array.from(fetchSet);
	};

	fetchSet.add(ids[currentIndex]);

	if (currentIndex > 0) fetchSet.add(ids[currentIndex - 1]);
	if (currentIndex < ids.length - 1) fetchSet.add(ids[currentIndex + 1]);

	return Array.from(fetchSet);

};

export default async function Page() {

	const galleryItemIds = await getGalleryItemIds();

	console.log(galleryItemIds)
	if (galleryItemIds?.length === 0 || !galleryItemIds) return;

	const initialIds = selectInitialGalleryIds(galleryItemIds, 0);
	console.log(initialIds)
	const data = await getGalleryItems(initialIds);

	const { data: galleryItems } = data;

	return (

		<>
			<header className='h-32 w-full px-8 flex flex-col justify-center fixed top-0 left-0 lg:bg-transparent bg-neutral-100 pb-2 z-[60]'>

				<h1 className={`${roboto.className} font-semibold text-xl capitalize text-neutral-800 flex flex-col -space-y-1.5`}>
					<span>georges</span>
					<span>bréhier</span>
				</h1>

			</header>

			<main>

				{
					galleryItems && (

						<HorizontalGallery items={galleryItems} />

					)
				}

				{/* <VerticalGallery images={images} /> */}
			</main>

		</>

	);

};
