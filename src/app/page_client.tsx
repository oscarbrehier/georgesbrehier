"use client"

import GalleryScroll from '@/components/GalleryScroll';
import { GalleryPreview } from '@/components/GalleryPreview';
import { useEffect, useState } from 'react';

export default function PageClient({
	navItems,
	basePath,
	images
}: {
	basePath: string,
	images: string[],
	navItems: { path: string, title: string }[],
}) {

	const [currentImageIdx, setCurrentImageIdx] = useState(0);

	useEffect(() => {
		console.log(currentImageIdx)
	}, [currentImageIdx]);

	return (
		<div className="h-auto w-full">

			{/* <CursorFollow
				hideOnScroll={!isAtTop}
			/> */}

			<div className='h-auto w-full fixed top-8 left-8 text-black'>

				<p className='font-medium text-lg mb-8'>Georges Bréhier</p>

				<ul className=''>
					{navItems.map((item, idx) => (
						<li key={idx}>
							<a href={item.path} className='capitalize'>
								{item.title}
							</a>
						</li>
					))}
				</ul>

			</div>

			<GalleryPreview
				basePath={basePath}
				images={images}
				currentImageIdx={currentImageIdx}
				setCurrentImageIdx={setCurrentImageIdx}
			/>

			<GalleryScroll
				images={images}
				basePath={basePath}
				titles={[
					"title1",
					"title2",
					"title3",
				]}
				currentImageIdx={currentImageIdx}
				onScrollChange={setCurrentImageIdx}
			/>

		</div>

	);

};