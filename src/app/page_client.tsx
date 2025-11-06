"use client"

import GalleryScroll from '@/components/GalleryScroll';
import { GalleryPreview } from '@/components/GalleryPreview';
import { useEffect, useState } from 'react';
import { LayoutDebug } from '@/components/LayoutDebug';
import { cn } from '@/utils/utils';
import { useImageZoom } from '@/utils/context/imageZoom';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { bodoni } from '@/utils/fonts';

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

	useEffect(() => {
		const setVh = () => {
			document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
		};
		setVh();
		window.addEventListener("resize", setVh);
		return () => window.removeEventListener("resize", setVh);
	}, []);

	return (

		<div className="h-auto w-full bg-neutral-100">

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

			<div className='h-auto w-full lg:hidden flex flex-col items-center py-24 space-y-20 sm:px-0 px-2'>

				{images.map((image, idx) => (

					<div
						key={idx}
						className="w-full max-w-xl flex flex-col items-center space-y-2"
					>

						<img
							className="h-auto object-contain"
							src={`${basePath}/${image}`}
							alt=""
						/>

						<div className='w-full flex justify-between px-0'>

							<p
								className={cn("sm:text-lg text-md text-black font-medium capitalize")}
							>
								title{idx}
							</p>
							<p className={`sm:text-lg text-md text-black font-medium capitalize`}>
								110cm x 152cm
							</p>

						</div>

					</div>

				))}

			</div>

		</div>

	);

};