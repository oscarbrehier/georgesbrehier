"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import { Bodoni_Moda } from "next/font/google";

const bodoni = Bodoni_Moda({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	display: "swap",
});

gsap.registerPlugin(ScrollTrigger);

interface ArtworksScrollProps {
	images: string[];
	basePath: string;
	titles?: string[];
	onScrollChange?: (isAtTop: boolean) => void;
}

const scrollMultiplier = 0.5;

export default function ArtworksScroll({ images, basePath, titles, onScrollChange }: ArtworksScrollProps) {

	const [wrapperHeight, setWrapperHeight] = useState(0);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const imageRefs = useRef<HTMLImageElement[]>([]);


	const imageTitles = titles || images.map((img, index) => {
		const filename = img.split('/').pop()?.split('.')[0] || `Artwork ${index + 1}`;
		return filename.charAt(0).toUpperCase() + filename.slice(1);
	});

	useEffect(() => {

		const totalImages = images.length;
		const scrollDistance = window.innerHeight * totalImages * scrollMultiplier;
		const calculatedHeight = window.innerHeight + scrollDistance;

		setWrapperHeight(calculatedHeight);

	}, [images]);

	useLayoutEffect(() => {

		if (!containerRef.current) return;

		const totalImages = images.length;
		const scrollDistance = window.innerHeight * totalImages * scrollMultiplier;

		// const pinTrigger = ScrollTrigger.create({
		// 	trigger: containerRef.current,
		// 	start: "top top",
		// 	end: `+=${scrollDistance}`,
		// 	scrub: true,
		// 	pin: true,
		// });

		const scrollTrigger = ScrollTrigger.create({
			trigger: containerRef.current,
			start: "top top",
			end: `+=${scrollDistance}`,
			scrub: true,
			pin: true
		});

		gsap.set(imageRefs.current, { opacity: 0 });
		gsap.set(imageRefs.current[0], { opacity: 1 });

		images.forEach((_, i) => {
			const segmentSize = scrollDistance / totalImages;
			const segmentStart = i * segmentSize;
			const segmentEnd = (i + 1) * segmentSize;

			ScrollTrigger.create({
				trigger: containerRef.current,
				start: segmentStart,
				end: segmentEnd,
				onEnter: () => {
					gsap.set(imageRefs.current, { opacity: 0 });
					gsap.set(imageRefs.current[i], { opacity: 1 });
					setCurrentImageIndex(i);
				},
				onEnterBack: () => {
					gsap.set(imageRefs.current, { opacity: 0 });
					gsap.set(imageRefs.current[i], { opacity: 1 });
					setCurrentImageIndex(i);
				},
			});
		});

		return () => {
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};

	}, [images, onScrollChange]);

	return (
		<div
			style={{ height: `${wrapperHeight}px` }}
			className="w-full bg-white flex justify-center"
		>
			<div
				ref={containerRef}
				className="h-screen w-full max-w-2xl flex items-center justify-center relative"
			>
				{images.map((image, index) => (
					<img
						key={index}
						ref={(el) => {
							if (el) imageRefs.current[index] = el;
						}}
						src={`${basePath}/${image}`}
						alt={`artwork ${index + 1}`}
						style={{ opacity: index === 0 ? 1 : 0 }}
						className={`object-contain absolute w-full h-full`}
					/>
				))}
			</div>

			<div className="fixed bottom-8 right-8 z-30 flex flex-col items-end">
				<p className={`${bodoni.className} text-black text-7xl capitalize font-medium`}>
					{imageTitles[currentImageIndex]}
				</p>
				<p className={`text-black text-xl capitalize font-medium font-mono`}>
					110cm x 152cm
				</p>
			</div>
		</div>
	);
}