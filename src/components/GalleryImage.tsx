import { useImageZoom } from "@/utils/context/imageZoom";
import { cn } from "@/utils/utils";
import { Ref, RefAttributes, RefObject, useCallback, useEffect, useRef, useState } from "react";

export function GalleryImage({
	src,
	index,
	isVisible,
	ref,
}: {
	src: string;
	index: number;
	isVisible: boolean;
	ref?: Ref<HTMLImageElement> | undefined;
}) {

	// const originalDimensions = { width: 3024, height: 4032 };
	// const cropCordP1 = { x: 290, y: 957 };
	// const cropCordP2 = { x: 2812, y: 3310 };

	// const [box, setBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
	
	// const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const { isZoomed, toggleZoom } = useImageZoom();
	const imageRef = useRef<HTMLImageElement | null>(null);

	useEffect(() => {
		
		function handleOnScroll() {
			if (isZoomed) toggleZoom();
		};
		
		window.addEventListener("scroll", handleOnScroll);

		return () => {
			window.removeEventListener("scroll", handleOnScroll);
		};

	}, [isZoomed]);

	// useEffect(() => {

	// 	function calculateBoundingBox() {

	// 		if (!imageRef.current) return;

	// 		const rect = imageRef.current.getBoundingClientRect();

	// 		const scale = Math.min(rect.width / originalDimensions.width, rect.height / originalDimensions.height);

	// 		const renderedWidth = originalDimensions.width * scale;
	// 		const renderedHeight = originalDimensions.height * scale;

	// 		const marginX = (rect.width - renderedWidth) / 2;
	// 		const marginY = (rect.height - renderedHeight) / 2;

	// 		const x = cropCordP1.x * scale + rect.left + window.scrollX + marginX;
	// 		const y = cropCordP1.y * scale + rect.top + window.scrollY + marginY;
	// 		const width = (cropCordP2.x - cropCordP1.x) * scale;
	// 		const height = (cropCordP2.y - cropCordP1.y) * scale;

	// 		setBox({ x, y, width, height });

	// 	};

	// 	const resizeObserver = new ResizeObserver(calculateBoundingBox);
	// 	resizeObserver.observe(document.body);

	// 	window.addEventListener("resize", calculateBoundingBox);

	// 	return () => {
	// 		resizeObserver.disconnect();
	// 		window.removeEventListener("resize", calculateBoundingBox);
	// 	};

	// }, []);

	return (

		<>
			<img
				key={index}
				ref={(el) => {
					imageRef.current = el;
					if (typeof ref === "function") {
						ref(el);
					} else if (ref) {
						ref.current = el;
					};
				}}
				src={src}
				alt={`artwork ${index + 1}`}
				style={{ opacity: index === 0 ? 1 : 0}}
				onClick={() => toggleZoom()}
				className={cn(
					"object-contain absolute w-full h-full transition-all duration-300 ease-in-out", 
					isVisible ? "lg:pointer-events-auto pointer-events-none" : "pointer-events-none",
					isZoomed ? "0px" : "xl:py-8 py-14" 
				)}
			/>
			{/* {box && (
				<div
					style={{ top: `${box.y}px`, left: `${box.x}px`, width: `${box.width}px`, height: `${box.height}px` }}
					className="absolute bg-red-500 z-50 opacity-30 h-0"
				>

				</div>
			)} */}
		</>

	);

};