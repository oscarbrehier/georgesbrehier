// "use client";
// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// import { Bodoni_Moda } from "next/font/google";

// const bodoni = Bodoni_Moda({
// 	subsets: ["latin"],
// 	weight: ["400", "500", "600", "700", "800", "900"],
// 	style: ["normal", "italic"],
// 	display: "swap",
// });

// gsap.registerPlugin(ScrollTrigger);

// interface GalleryScrollProps {
// 	images: string[];
// 	basePath: string;
// 	currentImageIdx: number;
// 	onScrollChange: (index: number) => void;
// 	titles?: string[];
// }

// const scrollMultiplier = 0.5;

// export default function GalleryScroll({ 
// 	images, 
// 	basePath, 
// 	titles,
// 	currentImageIdx,
// 	onScrollChange 
// }: GalleryScrollProps) {

// 	const [wrapperHeight, setWrapperHeight] = useState(0);
// 	const [currentImageIndex, setCurrentImageIndex] = useState(0);
// 	const containerRef = useRef<HTMLDivElement | null>(null);
// 	const imageRefs = useRef<HTMLImageElement[]>([]);

// 	const imageTitles = titles || images.map((img, index) => {
// 		const filename = img.split('/').pop()?.split('.')[0] || `Artwork ${index + 1}`;
// 		return filename.charAt(0).toUpperCase() + filename.slice(1);
// 	});

// 	useEffect(() => {

// 		const totalImages = images.length;
// 		const scrollDistance = window.innerHeight * totalImages * scrollMultiplier;
// 		const calculatedHeight = window.innerHeight + scrollDistance;

// 		setWrapperHeight(calculatedHeight);

// 	}, [images]);

// 	useLayoutEffect(() => {

// 		if (!containerRef.current) return;

// 		const totalImages = images.length;
// 		const scrollDistance = window.innerHeight * totalImages * scrollMultiplier;

// 		// const pinTrigger = ScrollTrigger.create({
// 		// 	trigger: containerRef.current,
// 		// 	start: "top top",
// 		// 	end: `+=${scrollDistance}`,
// 		// 	scrub: true,
// 		// 	pin: true,
// 		// });

// 		const scrollTrigger = ScrollTrigger.create({
// 			trigger: containerRef.current,
// 			start: "top top",
// 			end: `+=${scrollDistance}`,
// 			scrub: true,
// 			pin: true,
// 		});

// 		gsap.set(imageRefs.current, { opacity: 0 });
// 		gsap.set(imageRefs.current[0], { opacity: 1 });

// 		images.forEach((_, i) => {
// 			const segmentSize = scrollDistance / totalImages;
// 			const segmentStart = i * segmentSize;
// 			const segmentEnd = (i + 1) * segmentSize;

// 			ScrollTrigger.create({
// 				trigger: containerRef.current,
// 				start: segmentStart,
// 				end: segmentEnd,
// 				onEnter: () => {
// 					gsap.set(imageRefs.current, { opacity: 0 });
// 					gsap.set(imageRefs.current[i], { opacity: 1 });
// 					setCurrentImageIndex(i);
// 					onScrollChange(i);
// 				},
// 				onEnterBack: () => {
// 					gsap.set(imageRefs.current, { opacity: 0 });
// 					gsap.set(imageRefs.current[i], { opacity: 1 });
// 					setCurrentImageIndex(i);
// 					onScrollChange(i);
// 				},
// 			});
// 		});

// 		return () => {
// 			ScrollTrigger.getAll().forEach((t) => t.kill());
// 		};

// 	}, [images, onScrollChange]);

// 	return (
// 		<div
// 			style={{ height: `${wrapperHeight}px` }}
// 			className="w-full bg-white flex justify-center"
// 		>
// 			<div
// 				ref={containerRef}
// 				className="h-screen w-full w flex items-center justify-center relative"
// 			>
// 				{images.map((image, index) => (
// 					<img
// 						key={index}
// 						ref={(el) => {
// 							if (el) imageRefs.current[index] = el;
// 						}}
// 						src={`${basePath}/${image}`}
// 						alt={`artwork ${index + 1}`}
// 						style={{ opacity: index === 0 ? 1 : 0 }}
// 						className={`object-contain absolute w-full h-full py-8`}
// 					/>
// 				))}
// 			</div>

// 			<div className="fixed bottom-8 right-8 z-30 flex flex-col items-end">
// 				<p className={`${bodoni.className} text-black text-7xl capitalize font-medium`}>
// 					{imageTitles[currentImageIndex] || `title${currentImageIndex + 1}`}
// 				</p>
// 				<p className={`text-black text-xl capitalize font-medium font-mono`}>
// 					110cm x 152cm
// 				</p>
// 			</div>
// 		</div>
// 	);
// }

"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { Bodoni_Moda } from "next/font/google";

const bodoni = Bodoni_Moda({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	display: "swap",
});

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface GalleryScrollProps {
	images: string[];
	basePath: string;
	currentImageIdx: number;
	onScrollChange: (index: number) => void;
	titles?: string[];
}

const scrollMultiplier = 0.5;

export default function GalleryScroll({
	images,
	basePath,
	titles,
	currentImageIdx,
	onScrollChange
}: GalleryScrollProps) {

	const [wrapperHeight, setWrapperHeight] = useState(0);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isScrollingProgrammatically, setIsScrollingProgrammatically] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const imageRefs = useRef<HTMLImageElement[]>([]);
	const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

	const imageTitles = titles || images.map((img, index) => {
		const filename = img.split('/').pop()?.split('.')[0] || `Artwork ${index + 1}`;
		return filename.charAt(0).toUpperCase() + filename.slice(1);
	});

	// Handle external currentImageIdx changes
	useEffect(() => {
		if (currentImageIdx !== currentImageIndex && currentImageIdx >= 0 && currentImageIdx < images.length) {
			setIsScrollingProgrammatically(true);
			scrollToImage(currentImageIdx);
		}
	}, [currentImageIdx]);

	// Function to scroll to a specific image index
	const scrollToImage = (targetIndex: number) => {
		if (!containerRef.current || !scrollTriggerRef.current || targetIndex < 0 || targetIndex >= images.length) return;

		const totalImages = images.length;
		const progress = targetIndex / Math.max(totalImages - 1, 1);

		// Use ScrollTrigger's actual range for accurate positioning
		const scrollTrigger = scrollTriggerRef.current;
		const startPos = scrollTrigger.start;
		const endPos = scrollTrigger.end;
		const scrollDistance = endPos - startPos;
		const targetPosition = startPos + (progress * scrollDistance);

		console.log('Scrolling to index:', targetIndex, 'position:', targetPosition);

		// Use GSAP to scroll to position
		gsap.to(window, {
			duration: 1,
			scrollTo: { y: targetPosition, autoKill: false },
			ease: "power2.out",
			onComplete: () => {
				// Reset the flag after scroll completes
				setTimeout(() => {
					setIsScrollingProgrammatically(false);
				}, 100);
			}
		});
	};

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

		// Create the main scroll trigger for pinning
		scrollTriggerRef.current = ScrollTrigger.create({
			trigger: containerRef.current,
			start: "top top",
			end: `+=${scrollDistance}`,
			scrub: true,
			pin: true,
		});

		gsap.set(imageRefs.current, { opacity: 0 });
		gsap.set(imageRefs.current[0], { opacity: 1 });

		// Create scroll triggers for each image segment
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

					// Only call onScrollChange if we're not programmatically scrolling
					if (!isScrollingProgrammatically) {
						onScrollChange(i);
					}
				},
				onEnterBack: () => {
					gsap.set(imageRefs.current, { opacity: 0 });
					gsap.set(imageRefs.current[i], { opacity: 1 });
					setCurrentImageIndex(i);

					// Only call onScrollChange if we're not programmatically scrolling
					if (!isScrollingProgrammatically) {
						onScrollChange(i);
					}
				},
			});
		});

		return () => {
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};

	}, [images, onScrollChange, isScrollingProgrammatically]);

	return (
		<div
			style={{ height: `${wrapperHeight}px` }}
			className="w-full bg-white flex justify-center"
		>
			<div
				ref={containerRef}
				className="h-screen w-full flex items-center justify-center relative"
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
						className={`object-contain absolute w-full h-full py-8`}
					/>
				))}
			</div>

			<div className="fixed bottom-8 right-8 z-30 flex flex-col items-end">
				<p className={`${bodoni.className} text-black text-7xl capitalize font-medium`}>
					{imageTitles[currentImageIndex] || `title${currentImageIndex + 1}`}
				</p>
				<p className={`text-black text-xl capitalize font-medium font-mono`}>
					110cm x 152cm
				</p>
			</div>
		</div>
	);
}