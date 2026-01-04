import { Ellipsis } from "lucide-react";

export function GalleryItem({
	item
}: {
	item: GalleryItemWithCollection
}) {

	return (

		<div
			className="bg-neutral-200 flex items-center relative"
		>
			<img src={item.image_url} />
		</div>

	);

};