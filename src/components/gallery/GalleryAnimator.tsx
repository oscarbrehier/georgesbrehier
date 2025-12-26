"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useMemo } from "react";

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

			const totalWidth = sections.reduce((acc, section) => acc + section.offsetWidth, 0);

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

		const container = document.getElementById("gallery-container");
		if (!container) return;

		let selectedId: string | null = null;

		function handleClick(event: Event) {

			const target = (event.target as HTMLElement).closest("[data-itemid]") as HTMLElement | null;;
			if (!target) return;

			const id = target.dataset.itemid;

			if (id === selectedId) {
				clearSelected(container!);
				selectedId = null;
				return;
			};

			clearSelected(container!);
			target.classList.add("w-full", "h-full");
			selectedId = id ?? null;

		};

		function clearSelected(el: HTMLElement) {
			el.querySelectorAll("[data-itemid]").forEach((div) => {
				(div as HTMLElement).classList.remove("w-full", "h-full");
			});
		};

		container.addEventListener("click", handleClick);
		window.addEventListener("scroll", () => clearSelected(container));

		return () => {
			container.removeEventListener("click", handleClick);
			window.removeEventListener("scroll", () => clearSelected(container));
		};

	}, [items]);

	return null;

};