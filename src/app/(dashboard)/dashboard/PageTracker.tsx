'use client'

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageTracker() {

	const pathname = usePathname();
	
	useEffect(() => {
		sessionStorage.setItem("last_dashboard_path", pathname);
		sessionStorage.setItem("last_dashboard_timestamp", Date.now().toString());
	}, [pathname]);

	return null;

}