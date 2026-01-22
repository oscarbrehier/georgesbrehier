"use client"

import { cn } from "@/utils/utils";
import { Pencil, PencilOff } from "lucide-react";
import { useState } from "react";

export function EditModeToggle() {

	const [isEditing, setIsEditing] = useState(false);

	return (

		<button className={cn(
			"py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer",
			isEditing ? "bg-blue-600 text-neutral-50" : "bg-neutral-400 text-neutral-800"
		)}
			onClick={() => setIsEditing(prev => !prev)}
		>
			{isEditing ? <PencilOff size={18} /> : <Pencil size={18} />}
			<p className="text-sm">{isEditing ? "Exit Edit Mode" : "Edit"}</p>
		</button>

	);

};