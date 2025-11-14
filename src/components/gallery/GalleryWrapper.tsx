import { GalleryAnimator } from "./GalleryAnimator";
import { GalleryMarkup } from "./GalleryMarkup";

export default function GalleryWrapper({ 
	items
}: {
	items: GalleryItem[]
}) {

	return (

		<>
			<GalleryMarkup items={items} />
			<GalleryAnimator items={items} />
		</>

	);

};