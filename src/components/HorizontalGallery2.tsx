'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image, { StaticImageData } from 'next/image';

import { Bodoni_Moda } from "next/font/google";

const bodoni = Bodoni_Moda({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"], // optional if you want italics too
	display: "swap",
});

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface ImageItem {
	src: string | StaticImageData;
	alt?: string;
	content?: React.ReactNode;
}

interface HorizontalGalleryProps {
	images: (string | StaticImageData | ImageItem)[];
	basePath?: string;
}

const HorizontalGallery2: React.FC<HorizontalGalleryProps> = ({
	images,
	basePath = ''
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const galleryRef = useRef<HTMLDivElement>(null);

	const enableScrolling = false;


	useEffect(() => {

		if (!enableScrolling) return;

		const container = containerRef.current;
		const gallery = galleryRef.current;

		if (!container || !gallery || !images?.length) return;

		// Calculate total width needed for horizontal scroll
		const totalWidth = images.length * window.innerWidth;
		const scrollMultiplier = 0.25;

		// Set up horizontal scroll animation
		const scrollTween = gsap.to(gallery, {
			x: () => -(totalWidth - window.innerWidth),
			ease: "none",
			scrollTrigger: {
				trigger: container,
				start: "top top",
				end: () => `+=${(totalWidth - window.innerWidth) * scrollMultiplier}`,
				scrub: 1,
				pin: true,
				anticipatePin: 1,
				// snap: {
				// 	snapTo: (progress: number) => {
				// 		// Snap to each image (divide progress into equal parts)
				// 		const snapPoint = Math.round(progress * (images.length - 1)) / (images.length - 1);
				// 		return snapPoint;
				// 	},
				// 	duration: { min: 0.2, max: 0.5 },
				// 	delay: 0.1,
				// 	ease: "power2.inOut"
				// }
			}
		});

		// Cleanup function
		return () => {
			scrollTween.kill();
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	}, [images]);

	if (!images?.length) {
		return <div className="w-full h-screen flex items-center justify-center">No images provided</div>;
	}

	return (
		<div
			ref={containerRef}
			className="relative overflow-hidden"
			style={{ height: '100vh' }}
		>
			<div
				ref={galleryRef}
				className="flex"
				style={{
					width: `${images.length * 50}vw`,
					height: '100vh'
				}}
			>
				{images.map((image, index) => (

					<div
						key={index}
						className="flex-shrink-0 bg-neutral-50 h-screen w-[50vw] relative"
					>
						{/* Desktop Layout */}
						<div className="hidden md:flex flex-col h-full justify-center border-solid border-r-[1px] border-black">
							{/* Image Container */}
							<div className='h-auto relative flex-shrink-0 flex items-center'>
								<Image
									src={
										typeof image === 'string'
											? basePath ? `${basePath}/${image}` : image
											: 'src' in image
												? image.src
												: image
									}
									alt={
										typeof image === 'string'
											? `Gallery image ${index + 1}`
											: 'alt' in image && image.alt
												? image.alt
												: `Gallery image ${index + 1}`
									}
									width={0}
									height={0}
									sizes="80vh"
									className="h-4/5 w-auto object-contain"
									priority={index < 3}
								/>
							</div>

							<p className={`${bodoni.className} text-black text-6xl capitalize font-medium`}>
								title
							</p>

							{/* Text Container */}
							{/* <div className="flex-1 h-screen p-8 overflow-y-auto bg-white">
								{typeof image === 'object' && 'content' in image && image.content ? (
									image.content
								) : (
									<div className="flex items-center justify-center h-full">
										<p className="text-gray-500 text-lg">Add your text content here</p>
									</div>
								)}
							</div> */}

						</div>

						{/* Mobile Layout - Overlaid Text */}
						<div className="md:hidden h-screen w-screen relative">
							{/* Background Image */}
							<Image
								src={
									typeof image === 'string'
										? basePath ? `${basePath}/${image}` : image
										: 'src' in image
											? image.src
											: image
								}
								alt={
									typeof image === 'string'
										? `Gallery image ${index + 1}`
										: 'alt' in image && image.alt
											? image.alt
											: `Gallery image ${index + 1}`
								}
								fill
								className="object-contain"
								priority={index < 3}
							/>

							{/* Overlaid Text Content */}
							<div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6">
								<div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-sm mx-auto">
									{typeof image === 'object' && 'content' in image && image.content ? (
										image.content
									) : (
										<div className="text-center">
											<p className="text-gray-800 text-lg">Add your text content here</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				))}

			</div>
		</div>
	);
};

export default HorizontalGallery2;