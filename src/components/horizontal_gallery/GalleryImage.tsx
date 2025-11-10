import { cn } from "@/utils/utils";
import Image from "next/image";
import { memo } from "react";

export const GalleryImage = memo(function GalleryImage({
	src,
	onNavigate,
	onClick,
	isTransitioning,
	focused
}: {
	src: { url: string, title: string, currentIdx?: number, totalImages?: number }
	onNavigate?: () => void,
	onClick?: () => void,
	isTransitioning: boolean,
	focused?: boolean
}) {

	return (

		<div
			onClick={focused ? onClick : onNavigate}
			className={cn(
				`transition-all duration-500`,
				focused 
					? ``
					: `cursor-pointer flex-shrink-0 ${isTransitioning ? 'opacity-50' : 'opacity-60 hover:opacity-80'}`
		)}>

			<div className={cn(
				`w-auto aspect-[4/5] overflow-hidden rounded-md`,
				focused ? `relative xl:h-[70vh] h-[60vh]` : `relative xl:h-80 h-64`
			)}>

				<Image
					src={src.url ?? null}
					alt={src.title}
					className="w-full h-full object-cover"
					width={600}
					height={800}
					loading={focused ? "eager" : "lazy"}
					fetchPriority={focused ? "high" : "auto"}
				/>
				
			</div>

		</div>

	);

});