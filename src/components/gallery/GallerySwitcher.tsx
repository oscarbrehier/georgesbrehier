"use client"

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const GalleryStack = dynamic(() => import("@/components/gallery/GalleryStack"));
const GallerySpread = dynamic(() => import("@/components/gallery/GallerySpread"));

export const BREAKPOINT_GALLERY_STACK = 1024;

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

		const checkMobile = () => setIsMobile(window.innerWidth < BREAKPOINT_GALLERY_STACK);
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