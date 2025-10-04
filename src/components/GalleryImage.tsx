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
					"object-contain absolute w-full h-full py-24 md:px-0 px-20", 
					isVisible ? "lg:pointer-events-auto pointer-events-none" : "pointer-events-none",
					// isZoomed ? "lg:scale-110 transition-all duration-150 ease-in-out py-24" : "py-24"
				)}
			/>
		</>

	);

};