import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";


type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: React.ReactNode;
	Icon?: LucideIcon;
	size?: "icon" | "sm" | "md";
	variant?: "base" | "destructive";
	loading?: boolean;
};

export function Button({ children, Icon, className, size = "md", variant = "base", loading, ...props }: ButtonProps) {

	const sizes = {
		"icon": "p-2 rounded-lg",
		"sm": "py-1 px-3 rounded-lg",
		"md": "py-2 px-4 rounded-xl",
	}

	const iconSize = size === "md" ? "18" : "14";

	const colors = {
		base: "bg-neutral-200 hover:bg-neutral-300 text-neutral-800",
		destructive: "bg-red-600 hover:bg-red-700 text-neutral-50"
	};

	return (
		<button
			className={cn(
				"flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed",
				sizes[size],
				colors[variant],
				className
			)}
			{...props}
		>
			{Icon && <Icon className={cn(loading && "animate-spin")} size={iconSize} />}
			{children}
		</button>

	);

};

export function ButtonText({ children }: { children?: React.ReactNode }) {
	return (
		<p className="text-sm">{children}</p>
	);
};