"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

export function GalleryPreview({
	basePath,
	images,
	currentImageIdx,
	setCurrentImageIdx
}: {
	basePath: string;
	images: string[];
	currentImageIdx: number;
	setCurrentImageIdx: (index: number) => void;
}) {

	const galleryMaxItems = 3;
	const [galleryImages, setGalleryImages] = useState(images.slice(0, 3));
	const [highlightedImage, setHighlightedImage] = useState(0);

	useEffect(() => {

		if (currentImageIdx + galleryMaxItems < images.length) {
			setGalleryImages(images.slice(currentImageIdx, currentImageIdx + galleryMaxItems));
			setHighlightedImage(0);
		} else {
			setGalleryImages(images.slice(-galleryMaxItems));
			setHighlightedImage(currentImageIdx - (images.length - galleryMaxItems));
		}

	}, [currentImageIdx]);

	return (

		<div className='h-auto w-20 fixed bottom-8 left-8 space-y-2 z-50 w'>
			{
				galleryImages.map((image, idx) => {

					const parentIndex = images.indexOf(image); // this MUST always match parent array
					return (
						<div key={idx} onClick={() => setCurrentImageIdx(parentIndex)} className="cursor-pointer">
							<Image
								className={`object-contain ${currentImageIdx === parentIndex ? "opacity-100" : "opacity-70"}`}
								width={600}
								height={800}
								src={`${basePath}/${image}`}
								alt=""
							/>
						</div>
					)

				})
			}
		</div>

	);

};