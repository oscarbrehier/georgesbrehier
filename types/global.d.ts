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
		createAt: string;
	};
	interface GallerySection {
		id: string;
		title: string;
		is_default: boolean;
		slug?: string;
	};
	interface GalleryCollection {
		id: string;
		section_id: string;
		title: string;
		is_default: boolean;
		slug?: string;
	};
	interface GalleryCollectionWithSection extends GalleryCollection {
		section: GallerySection
	};
};

export {};