"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

const leftMargin = 144;
gsap.registerPlugin(ScrollTrigger);

export function GalleryAnimator({
	items,
}: {
	items: GalleryItem[],
}) {

	useEffect(() => {

		if (!items.length) return;

		const ctx = gsap.context(() => {

			const track = document.getElementById("gallery-track");
			const wrapper = document.getElementById("gallery-wrapper");
			
			if (!track || !wrapper) return;

			const getDistance = () => wrapper.scrollWidth - (window.innerWidth - 144);

			const scrollTween = gsap.to(wrapper, {
				x: () => -getDistance(),
				ease: "none",
				scrollTrigger: {
					trigger: track,
					start: "top top",
					end: () => `+=${getDistance()}`,
					scrub: 1.2,
					invalidateOnRefresh: true,
					onRefresh: () => {
						if (track) {
							track.style.height = `${getDistance() + window.innerHeight}px`;
						}
					}
				}
			});

			const ro = new ResizeObserver(() => {
				ScrollTrigger.refresh();
			});

			ro.observe(wrapper);

			return () => ro.disconnect();

		});

		return () => ctx.revert();

	}, [items]);

	useEffect(() => {

		const container = document.getElementById("gallery-container");
		if (!container) return;

		let selectedId: string | null = null;
		let isAnySelected = false;

		function clearSelected() {

			if (!isAnySelected) return;

			container!.querySelectorAll("[data-itemid]").forEach((div) => {
				(div as HTMLElement).classList.remove("w-full", "h-full");
			});

			selectedId = null;
			isAnySelected = false;

		};

		function handleClick(event: Event) {

			const target = (event.target as HTMLElement).closest("[data-itemid]") as HTMLElement | null;
			if (!target) return;

			const id = target.dataset.itemid || null;

			if (id === selectedId) {
				clearSelected();
			} else {

				clearSelected();

				target.classList.add("w-full", "h-full");
				selectedId = id;
				isAnySelected = true;
			};

		};

		container.addEventListener("click", handleClick);

		const trigger = ScrollTrigger.create({
			onUpdate: (self) => {
				if (Math.abs(self.getVelocity()) > 10) {
					clearSelected();
				};
			}
		});

		return () => {
			container.removeEventListener("click", handleClick);
			trigger.kill();
		};

	}, [items]);

	return null;

};