"use client"

import { cn } from "@/utils/utils";
import { useState } from "react";

export function LayoutDebug() {

	const [active, setActive] = useState(true);

	if (process.env.NODE_ENV !== "development") return (null);

	return (

		<div className="fixed top-0 left-0 h-screen w-full p-8 z-50 pointer-events-none">
			<div className={cn("h-full w-full z-50 flex justify-end", active && "border-[1px] border-solid border-red-400")}>
				<div className={cn("size-10 bg-green-200 pointer-events-auto rounded-full", !active && "opacity-20 hover:opacity-100")} onClick={() => setActive(v => !v)}>

				</div>
			</div>
		</div>

	);

};