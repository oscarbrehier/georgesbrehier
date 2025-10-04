"use client"

import GalleryScroll from '@/components/GalleryScroll';
import { GalleryPreview } from '@/components/GalleryPreview';
import { useEffect, useState } from 'react';
import { LayoutDebug } from '@/components/LayoutDebug';
import { cn } from '@/utils/utils';
import { useImageZoom } from '@/utils/context/imageZoom';
import { Navbar } from '@/components/Navbar';

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
	const { style } = useImageZoom();

	return (
		<div className="h-auto w-full">

			{/* <CursorFollow
				hideOnScroll={!isAtTop}
			/> */}

			{/* <LayoutDebug /> */}

			<Navbar navItems={navItems} />

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