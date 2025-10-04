"use client"

import { useImageZoom } from "@/utils/context/imageZoom";
import { cn } from "@/utils/utils";
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

		let startIdx = Math.max(0, currentImageIdx - 1);
		let endIdx = startIdx + galleryMaxItems;

		if (endIdx > images.length) {
			endIdx = images.length;
			startIdx = Math.max(0, endIdx - galleryMaxItems);
		}

		setGalleryImages(images.slice(startIdx, endIdx));

		if (currentImageIdx === 0) {
			setHighlightedImage(0);
		} else if (currentImageIdx === images.length - 1) {
			setHighlightedImage(galleryImages.length - 1);
		} else {
			setHighlightedImage(1);
		};

	}, [currentImageIdx]);

	const { style } = useImageZoom();

	return (

		<div className={cn("h-auto w-20 fixed space-y-2 z-50 transition-all duration-300 ease-in-out bottom-8 left-8 lg:block hidden")} style={style}>
			{
				galleryImages.map((image, idx) => {
					const parentIndex = images.indexOf(image);
					return (
						<div key={idx} onClick={() => setCurrentImageIdx(parentIndex)} className="cursor-pointer">
							<Image
								className={`object-contain ${idx === highlightedImage ? "opacity-100" : "opacity-70"}`}
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