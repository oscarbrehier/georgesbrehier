import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode;
	size?: "sm" | "md";
	variant?: "base"
};

export function Badge({ children, className, size = "md", variant, ...props }: BadgeProps) {

	return (
		<div
			className={cn(
				"flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed",
				size == "md" ? "py-2 px-4 rounded-xl" : "py-1 px-3 rounded-lg",
				variant === "base" && "bg-neutral-200 hover:bg-neutral-300 text-neutral-800",
				className
			)}
			{...props}
		>
			<p className="text-sm">{children}</p>
		</div>

	);

};