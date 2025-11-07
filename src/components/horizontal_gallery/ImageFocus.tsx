import { X } from "lucide-react";

export function ImageFocus({
	src,
	onClose
}: {
	src: GalleryItem,
	onClose: () => void
}) {

	return (

		<>

			<button onClick={onClose} className="absolute top-8 right-8 p-3 bg-neutral-100 rounded-full flex-none text-neutral-800 cursor-pointer z-[69] www ww">
				<X />
			</button>

			<div className="bg-foreground z-50 h-screen w-full absolute flex items-center justify-center p-8 top-0 left-0">
				<img
					className="h-full"
					src={src.image_url}
					alt={src.title}
				/>
			</div>

		</>


	);

};