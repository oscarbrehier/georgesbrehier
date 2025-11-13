"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function ScrollHint() {

	const [mounted, setMounted] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isHiding, setIsHiding] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {

		if (!mounted) return;

		const show = localStorage.getItem("scroll_hint") !== "false";
		if (!show) return;

		setIsVisible(true);

		const handleScroll = () => {

			setIsHiding(true);
			localStorage.setItem("scroll_hint", "false");

			setTimeout(() => setIsVisible(false), 500);

		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);

	}, [mounted]);

	if (!mounted || !isVisible) return null;

	const hint = (

		<div
			className={`fixed bottom-8 right-8 z-[70] lg:flex hidden items-center justify-around rounded-full bg-neutral-700 p-3 text-white transition-all duration-500 ${isHiding ? "opacity-0 scale-95" : "opacity-100 animate-float"
				}`}
		>
			<ArrowDown />
		</div>

	);

	return createPortal(hint, document.body);

};