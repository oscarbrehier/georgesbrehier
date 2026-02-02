"use client"

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const GalleryStack = dynamic(() => import("@/components/gallery/GalleryStack"));
const GallerySpread = dynamic(() => import("@/components/gallery/GallerySpread"));

export function GallerySwitcher({
	items,
	collections,
	currentCollection,
}: {
	items: GalleryItem[];
	collections: CollectionNavItem[];
	currentCollection: string;
}) {

	const [isMobile, setIsMobile] = useState<Boolean | null>(null);

	useEffect(() => {

		const checkMobile = () => setIsMobile(window.innerWidth < 640);
		checkMobile();

		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);

	}, []);

	if (isMobile === null) return null;

	const GalleryComponent = isMobile ? GalleryStack : GallerySpread;

	return <GalleryComponent
		items={items}
		collections={collections}
		currentCollection={currentCollection}
	/>

};