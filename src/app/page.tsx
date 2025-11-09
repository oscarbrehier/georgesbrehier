import HorizontalGallery from '@/components/horizontal_gallery/Gallery';
import { VerticalGallery } from '@/components/vertical_gallery/Gallery';
import { roboto } from '@/utils/fonts';
import { promises as fs } from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { getGalleryItemIds, getGalleryItems } from '@/utils/supabase/getGalleryItems';
import { Gallery } from '@/components/Gallery';

export const metadata: Metadata = {

};


export default async function Page() {

	const { data: galleryItems, error } = await getGalleryItems();
	if (error || !galleryItems || galleryItems.length === 0) return;

	return (

		<>
			{/* <header className='h-32 w-full px-8 flex flex-col justify-center fixed top-0 left-0 lg:bg-transparent bg-neutral-100 pb-2 z-[60]'>

				<h1 className={`${roboto.className} font-semibold text-xl capitalize text-neutral-800 flex flex-col -space-y-1.5`}>
					<span>georges</span>
					<span>bréhier</span>
				</h1>

			</header> */}

			<header className='h-screen w-36 p-8 fixed top-0 left-0 bg-foreground z-[60] flex flex-col items-center'>

				<h1 className={`${roboto.className} font-semibold text-xl capitalize text-neutral-800 flex flex-col -space-y-1.5`}>
					<span>georges</span>
					<span>bréhier</span>
				</h1>

				<nav className='w-full text-black w mt-20'>

					<ul>
						<li>96</li>
						<li>small</li>
						<li>trous</li>
						<li>volume</li>
					</ul>

				</nav>

			</header>

			<main>

				{galleryItems && (
					<>
						<Gallery items={galleryItems} />
						<VerticalGallery images={galleryItems} />
					</>
				)}

			</main>

		</>

	);

};
