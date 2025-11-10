"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image";
import { useEffect, useRef } from "react";

const leftMargin = 144;

export function Gallery({
	items,
}: {
	items: GalleryItem[],
}) {

	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {

		if (!containerRef.current) return;

		document.documentElement.classList.add("hide-scrollbar");
		document.body.classList.add("hide-scrollbar");

		gsap.registerPlugin(ScrollTrigger);

		const sections = gsap.utils.toArray(".panel");

		const totalWidth = sections.reduce((acc: number, section) => {
			return acc + (section as HTMLElement).offsetWidth;
		}, 0);

		const scrollDistance = totalWidth - window.innerWidth + leftMargin;

		const animation = gsap.to(sections, {
			x: () => -scrollDistance,
			ease: "none",
			scrollTrigger: {
				trigger: containerRef.current,
				pin: true,
				scrub: 1,
				snap: 1 / (sections.length - 1),
				end: () => "+=" + scrollDistance
			}
		});

		return () => {
			document.documentElement.classList.remove('hide-scrollbar');
			document.body.classList.remove('hide-scrollbar');
			animation.kill();
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};

	}, [items]);

	return (

		<div ref={containerRef} className={`lg:flex hidden hide-scrollbar ml-36`}>

			{items.map((item, idx) => (

				<div
					key={`gallery-${item.title}-${idx}`}
					className="panel h-screen 2xl:w-[30vw] xl:w-[40vw] w-[50vw] relative flex items-center justify-center shrink-0"
				>

					<div className="relative w-3/4 h-[80%]">
						<Image
							src={item.image_url}
							alt={item.title}
							fill
							style={{ objectFit: "contain" }}
							loading={idx < 3 ? "eager" : "lazy"}
						/>
					</div>

				</div>

			))}

		</div>

	)

}