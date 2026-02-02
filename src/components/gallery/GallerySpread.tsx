import { GalleryAnimator } from "./GalleryAnimator";
import { GalleryMarkup } from "./GalleryMarkup";

export default function GallerySpread({
	items,
	collections,
	currentCollection
}: {
	items: GalleryItem[];
	collections: CollectionNavItem[];
	currentCollection: string;
}) {

	return (

		<>
			<GalleryMarkup
				collections={collections}
				currentCollection={currentCollection}
				items={items}
			/>
			<GalleryAnimator items={items} />
		</>

	);

};