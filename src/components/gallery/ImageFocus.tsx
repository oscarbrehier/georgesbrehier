import { X } from "lucide-react";

export function ImageFocus({
	src,
	onClose
}: {
	src: GalleryImageItem,
	onClose: () => void
}) {

	return (

		<div
			className="fixed inset-0 h-screen w-full bg-foreground z-50 p-8 flex items-start"
		>
			
			<button onClick={onClose} className="p-3 bg-white rounded-full flex-none text-neutral-800 cursor-pointer z-50">
				<X />
			</button>

			<div className="h-screen w-full absolute flex items-center justify-center p-8 top-0 left-0">
				<img
					className="h-full"
					src={src.url}
					alt={src.title}
				/>
			</div>

		</div>

	);

};