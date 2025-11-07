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
	}
};

export {};