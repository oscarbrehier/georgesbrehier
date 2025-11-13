import { cn } from "@/utils/utils";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string | React.ReactNode;
	id: string;
	sublabel?: string | React.ReactNode;
};

export function Input({ label, id, sublabel, ...props }: InputProps) {
	
	return (

		<div className="w-full">

			<label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-2">
				{label}
			</label>

			<input
				id={id}
				{...props}
				className={cn("w-full px-4 h-12 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all", props.className)}
			/>

			{
				sublabel && (
					<p className="text-neutral-600 text-xs w mt-1.5">{sublabel}</p>
				)
			}

		</div>

	);

};