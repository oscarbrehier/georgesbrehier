"use client"

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from './GalleryImage';
import { ImageFocus } from './ImageFocus';

export default function HorizontalGallery({
	items
}: {
	items: GalleryItem[]
}) {

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [imageFocus, setImageFocus] = useState<GalleryItem | null>(null);

	const getImageAtIndex = (offset: number) => {
		const index = (currentIndex + offset + items.length) % items.length;
		return items[index];
	};

	const navigate = useCallback((direction: "next" | "prev") => {

		if (isTransitioning) return;

		setIsTransitioning(true);

		setCurrentIndex((prev) => {
			if (direction === 'next') {
				return (prev + 1) % items.length;
			} else {
				return (prev - 1 + items.length) % items.length;
			}
		});

		setTimeout(() => setIsTransitioning(false), 500);

	}, [isTransitioning, items.length]);

	useEffect(() => {

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') navigate('prev');
			if (e.key === 'ArrowRight') navigate('next');
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);

	}, [isTransitioning]);

	const prevImage = getImageAtIndex(-1);
	const currentImage = getImageAtIndex(0);
	const nextImage = getImageAtIndex(1);

	return (

		<>

			{
				imageFocus !== null && (
					<ImageFocus
						src={imageFocus}
						onClose={() => setImageFocus(null)}
					/>
				)
			}

			<section
				className="lg:flex hidden h-screen items-center justify-center p-8 bg-neutral-100"
				aria-label="Artwork gallery"
			>

				<div className="w-full max-w-7xl">

					<nav
						className="relative flex items-center justify-center gap-8"
						aria-label="Gallery navigation"
					>

						<GalleryImage
							src={{ url: prevImage.image_url, title: prevImage.title }}
							onNavigate={() => navigate("prev")}
							isTransitioning={isTransitioning}
						/>

						<GalleryImage
							src={{ url: currentImage.image_url, title: currentImage.title }}
							isTransitioning={isTransitioning}
							onClick={() => setImageFocus(currentImage)}
							focused
						/>

						<GalleryImage
							src={{ url: nextImage.image_url, title: nextImage.title }}
							onNavigate={() => navigate("next")}
							isTransitioning={isTransitioning}

						/>

					</nav>

					<div
						className='w-full h-auto flex justify-center space-x-2 mt-4'
						role="group"
						aria-label="Gallery controls"
					>

						<button
							onClick={() => navigate('prev')}
							disabled={isTransitioning}
							className='p-3 rounded-full bg-white text-neutral-800 cursor-pointer'
							aria-label={`Previous image: ${prevImage.title}`}
							title="Previous image"
						>
							<ChevronLeft />
						</button>

						<button
							onClick={() => setCurrentIndex(0)}
							className='text-neutral-800 bg-white rounded-full px-5 py-3 cursor-pointer disabled:text-neutral-500'
							disabled={currentIndex === 0}
							aria-label={`Return to first image`}
							title="Back to start"
						>
							Back to start
						</button>

						<button
							onClick={() => navigate('next')}
							disabled={isTransitioning}
							className='p-3 rounded-full bg-white text-neutral-800 cursor-pointer'
							aria-label={`Next image: ${nextImage.title}`}
							title="Next image"
						>
							<ChevronRight />
						</button>

					</div>

				</div>

			</section>

		</>


	);
};