"use client";

const circleSize = 140;

import { useEffect, useRef, useState } from "react";

export function CursorFollow({
	hideOnScroll = false
}: {
	hideOnScroll: boolean
}) {

	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const [mouseHistory, setMouseHistory] = useState<{ x: number; y: number }[]>([]);
	const [circlePos, setCirclePos] = useState({ x: -circleSize, y: -circleSize });
	const [isMoving, setIsMoving] = useState(false);

	const mouseHistoryRef = useRef<{ x: number; y: number }[]>([]);
	const circlePosRef = useRef({ x: 0, y: 0 });

	useEffect(() => {

		function handleMouseMove(e: MouseEvent) {

			if (!isMoving) {
				setIsMoving(true);
			}

			const x = e.clientX;
			const y = e.clientY;

			const newHistory = [...mouseHistoryRef.current, { x, y }].slice(-5);
			mouseHistoryRef.current = newHistory;
			setMouseHistory(newHistory);

			if (newHistory.length < 2) {
				setMousePos({ x, y });
				return;
			}

			const oldest = newHistory[0];
			const newest = newHistory[newHistory.length - 1];
			const deltaX = newest.x - oldest.x;
			const deltaY = newest.y - oldest.y;

			const magnitude = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

			if (magnitude > 0) {
				const normalizeX = deltaX / magnitude;
				const normalizeY = deltaY / magnitude;
				const oppositeX = -normalizeX;
				const oppositeY = -normalizeY;

				const circleX = x + (oppositeX * 50);
				const circleY = y + (oppositeY * 50);

				const newPositionX = circlePosRef.current.x + (circleX - circlePosRef.current.x) * 0.1;
				const newPositionY = circlePosRef.current.y + (circleY - circlePosRef.current.y) * 0.1;

				const newCirclePos = { x: newPositionX, y: newPositionY };
				circlePosRef.current = newCirclePos;
				setCirclePos(newCirclePos);
			}

			setMousePos({ x, y });
		}

		function handleMouseEnter() {
			setIsMoving(true);
		}

		function handleMouseLeave() {
			setIsMoving(false);
		}

		document.body.addEventListener("mouseenter", handleMouseEnter);
		document.body.addEventListener("mouseleave", handleMouseLeave);
		window.addEventListener("mousemove", handleMouseMove, { passive: true });

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			document.body.removeEventListener("mouseenter", handleMouseEnter);
			document.body.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [isMoving]);

	useEffect(() => {
		const initialPos = { x: window.innerWidth - (circleSize / 2), y: circleSize / 2 };
		setCirclePos(initialPos);
		circlePosRef.current = initialPos; // Add this line
	}, []);

	return (isMoving && !hideOnScroll) ? (
		<div
			style={{ left: circlePos.x, top: circlePos.y, height: `${circleSize}px`, width: `${circleSize}px` }}
			className="fixed rounded-full bg-[#00b894] opacity-80 z-40 flex items-center justify-center pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
		>
			<p className="text-center select-none text-black">Scroll down</p>
		</div>
	) : null;
}