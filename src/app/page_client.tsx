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

		<div className="h-auto w-full bg-white">

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

			<div className='h-auto w-screen flex flex-col items-center pt-24 space-y-20'>

				{images.map((image, idx) => (

					<div
						key={idx}
						className="w-full max-w-xl flex flex-col items-center space-y-4"
					>

						<img
							className="h-auto object-contain"
							src={`${basePath}/${image}`}
							alt=""
						/>

						{/* <div className='w-full flex justify-between'>

							<p
								className={cn("capitalize text-black text-4xl w font-medium", bodoni.className)}
							>
								title{idx}
							</p>
							<p className={`text-black text-xl capitalize font-medium font-mono`}>
								110cm x 152cm
							</p>

						</div> */}

					</div>

				))}

			</div>

		</div>

	);

};