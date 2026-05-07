"use client"

import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardButton() {

	const [prevPath, setPrevPath] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const savedPath = sessionStorage.getItem("last_dashboard_path");
		const savedTimestamp = sessionStorage.getItem("last_dashboard_timestamp");

		if (savedPath && savedTimestamp) {

			const now = Date.now();
			const then = parseInt(savedTimestamp);

			if (now - then < 10000) {
				setPrevPath(savedPath);
			} else {
				clearStorage();
			};

		};

	}, []);

	function clearStorage() {
		sessionStorage.removeItem("last_dashboard_path");
		sessionStorage.removeItem("last_dashboard_timestamp");
	};

	function handleBack() {

		if (prevPath) {
			clearStorage();
			router.push(prevPath);
		};

	};

	return (
		<div className="fixed bg-neutral-800 text-neutral-100 z-50 bottom-6 right-6 rounded-xl">
			{prevPath ? (
				<button onClick={handleBack} className="flex items-center space-x-2 py-2 px-4 hover:cursor-pointer">
					<ArrowLeft size="16" />
					<p className="text-sm">Back to Dashboard</p>
				</button>
			) : (
				<a href="/dashboard" className="text-sm flex items-center space-x-2 py-2 px-4">
					<LayoutDashboard size="16" />
					<span className="text-sm">Dashboard</span>
				</a>
			)}
		</div>
	);

};