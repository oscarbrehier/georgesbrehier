"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function VerticalGallery({ images }: { images: GalleryImageItem[] }) {

	const IMAGES_PER_LOAD = 5;

	const [displayedImages, setDisplayedImages] = useState<GalleryImageItem[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	const observerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {

		const initial = images.slice(0, IMAGES_PER_LOAD);

		setDisplayedImages(initial);
		setCurrentIndex(initial.length);

	}, [images]);

	function loadMoreImages() {

		const next = images.slice(currentIndex, currentIndex + IMAGES_PER_LOAD);

		if (next.length === 0) return;

		setDisplayedImages(prev => [...prev, ...next]);
		setCurrentIndex(prev => prev + next.length);

	};

	useEffect(() => {

		if (!observerRef.current) return;

		const observer = new IntersectionObserver(entries => {

			if (entries[0].isIntersecting) {
				loadMoreImages();
			};

		}, { threshold: 0.1, rootMargin: '0px 0px 300px 0px' });

		observer.observe(observerRef.current);

		return () => observer.disconnect();

	}, []);

	function scrollToTop() {

		if (typeof window === 'undefined') return;
		window.scrollTo({ top: 0, behavior: "smooth" });

	};

	const allImagesLoaded = displayedImages.length >= images.length;

	return (

		<div className="lg:hidden flex h-auto w-full flex-col items-center pt-32 p-8 space-y-8">

			{displayedImages.map((image, idx) => (

				<div key={`${image.id}-${idx}`} className="max-w-xl">

					<Image
						src={image.url}
						width={600}
						height={800}
						alt={image.title}
						className="w-full h-auto"
					/>

				</div>

			))}

			{allImagesLoaded && (

				<div className="w-full h-auto flex justify-center">

					<button
						onClick={scrollToTop}
						className='text-neutral-800 bg-white rounded-full px-5 py-3 cursor-pointer disabled:text-neutral-500'
					>
						Back to top
					</button>

				</div>

			)}

			{currentIndex < images.length && <div ref={observerRef} className="h-20 w-full" />}

		</div>

	);

};