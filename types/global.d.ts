declare global {
	interface GalleryImageItem {
		id?: number;
		url: string;
		title: string;
	};

	interface GalleryItem {
		id: number;
		title: string;
		description: string;
		image_url: string;
		section: string;
		position: number;
		created_at: string;
	};

	interface GallerySection {
		id: string;
		title: string;
		is_default: boolean;
		slug: string;
		is_visible: boolean;
		position: number;
	};

	interface GalleryCollectionWithItems extends GalleryItem {
		works: GalleryItem;
	};

	interface GallerySectionTree {
		id: string;
		slug: string;
		collections: {
			id: string;
			slug: string;
			title: string;
			is_default: boolean;
			is_visible: boolean;
			works: GalleryItem[];
		}[];
	};

	interface SectionWithDefaultCollection extends GallerySection {
		defaultCollection: GalleryCollection
	};

	interface GalleryCollection {
		id: string;
		section_id: string;
		title: string;
		is_default: boolean;
		slug: string;
		is_visible: boolean;
		seo_title: string,
		seo_description: string,
		seo_og_image_url: string,
		seo_og_image_width: number,
		seo_og_image_height: number,
		seo_og_image_alt: string,
		seo_twitter_image_url: string,
		seo_twitter_image_type: string,
		seo_canonical_url: null,
		seo_robots: string;
	};
	interface GalleryCollectionSEO {
		seo_title: string,
		seo_description: string,
		seo_og_image_url: string,
		seo_og_image_width: number,
		seo_og_image_height: number,
		seo_og_image_alt: string,
		seo_twitter_image_url: string,
		seo_twitter_image_type: string,
		seo_canonical_url: null,
		seo_robots: string
	};
	interface GalleryCollectionWithSection extends GalleryCollection {
		section: GallerySection
	};
	interface GalleryItemWithCollection extends GalleryItem {
		collection: GalleryCollection;
	};

	type GalleryItemToDelete = { id: number; collectionId: string };
};

export { };