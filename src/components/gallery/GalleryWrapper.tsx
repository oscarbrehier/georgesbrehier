import { GalleryAnimator } from "./GalleryAnimator";
import { GalleryMarkup } from "./GalleryMarkup";

export default async function GalleryWrapper({
	items,
	sectionId,
	currentCollection
}: {
	items: GalleryItem[];
	sectionId: string;
	currentCollection: string;
}) {

	return (

		<>
			<GalleryMarkup
				sectionId={sectionId}
				currentCollection={currentCollection}
				items={items}
			/>
			<GalleryAnimator items={items} />
		</>

	);

};