"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect } from "react";

const leftMargin = 144;
gsap.registerPlugin(ScrollTrigger);

export function GalleryAnimator({
	items,
}: {
	items: GalleryItem[],
}) {

	useEffect(() => {

		const mm = gsap.matchMedia();

		mm.add("(min-width: 1024px)", () => {

			const container = document.getElementById("gallery-container");
			if (!container) return;

			const sections = gsap.utils.toArray<HTMLElement>(".panel");

			const totalWidth = sections.reduce((acc: number, section) => {
				return acc + (section as HTMLElement).offsetWidth;
			}, 0);


			const panelWidth = sections[0].offsetWidth;
			const imageWidth = panelWidth * 0.75;
			const imageInsetLeft = (panelWidth - imageWidth) / 2;
			const imageRight = imageInsetLeft + imageWidth;
			const endPadding = (window.innerWidth / 2) - imageRight + imageWidth;

			const scrollDistance = totalWidth - window.innerWidth + leftMargin + endPadding;

			const animation = gsap.to(sections, {
				x: () => -scrollDistance,
				ease: "none",
				scrollTrigger: {
					trigger: container,
					pin: true,
					scrub: 1,
					end: () => "+=" + scrollDistance
				}
			});
			
		});

		return () => {
			mm.revert();
		};

	}, [items]);

	useEffect(() => {

		const imageContainers = document.querySelectorAll("[data-itemid]");
		let selectedId: string | null = null;

		function handleClick(event: Event) {

			const target = event.currentTarget as HTMLElement;
			const id = target.dataset.itemid;

			if (id === selectedId) {

				clearSelected();
				selectedId = null;
				return;

			};

			clearSelected();
			target.classList.add("w-full", "h-full");
			selectedId = id ?? null;

		};

		function clearSelected() {

			imageContainers.forEach(div => div.classList.remove("w-full", "h-full"));

		};

		imageContainers.forEach(div => div.addEventListener("click", handleClick));
		window.addEventListener("scroll", clearSelected);

		return () => {
			imageContainers.forEach(div => div.removeEventListener("click", handleClick));
			window.removeEventListener("scroll", clearSelected);
		};

	}, [items]);

	return null;

};