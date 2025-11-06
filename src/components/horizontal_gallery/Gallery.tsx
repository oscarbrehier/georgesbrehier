"use client"

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from './GalleryImage';
import { ImageFocus } from './ImageFocus';

export default function HorizontalGallery({
	images
}: {
	images: GalleryImageItem[]
}) {

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [imageFocus, setImageFocus] = useState<GalleryImageItem | null>(null);

	const getImageAtIndex = (offset: number) => {
		const index = (currentIndex + offset + images.length) % images.length;
		return images[index];
	};

	const navigate = (direction: "next" | "prev") => {

		if (isTransitioning) return;

		setIsTransitioning(true);

		setCurrentIndex((prev) => {
			if (direction === 'next') {
				return (prev + 1) % images.length;
			} else {
				return (prev - 1 + images.length) % images.length;
			}
		});

		setTimeout(() => setIsTransitioning(false), 500);

	};

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

			<div className="lg:flex hidden h-screen items-center justify-center p-8">

				<div className="w-full max-w-7xl">

					<div className="relative flex items-center justify-center gap-8">

						<GalleryImage
							src={{ url: prevImage.url, title: prevImage.title }}
							onNavigate={() => navigate("prev")}
							isTransitioning={isTransitioning}
						/>

						<GalleryImage
							src={{ url: currentImage.url, title: currentImage.title }}
							isTransitioning={isTransitioning}
							onClick={() => setImageFocus(currentImage)}
							focused
						/>

						<GalleryImage
							src={{ url: nextImage.url, title: nextImage.title }}
							onNavigate={() => navigate("next")}
							isTransitioning={isTransitioning}

						/>

					</div>

					<div className='w-full h-auto flex justify-center space-x-2 mt-8 border-2'>

						<button
							onClick={() => navigate('prev')}
							disabled={isTransitioning}
							className='p-3 rounded-full bg-white text-neutral-800 cursor-pointer'
							aria-label="Previous image"
						>
							<ChevronLeft />
						</button>

						<button
							onClick={() => setCurrentIndex(0)}
							className='text-neutral-800 bg-white rounded-full px-5 py-3 cursor-pointer disabled:text-neutral-500'
							disabled={currentIndex === 0}
						>
							Back to start
						</button>

						<button
							onClick={() => navigate('next')}
							disabled={isTransitioning}
							className='p-3 rounded-full bg-white text-neutral-800 cursor-pointer'
							aria-label="Next image"
						>
							<ChevronRight />
						</button>

					</div>

				</div>

			</div>

		</>


	);
};