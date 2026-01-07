import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";


type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: React.ReactNode;
	Icon?: LucideIcon;
	size?: "sm" | "md"
};

export function Button({ children, Icon, className, size = "md", ...props }: ButtonProps) {

	const iconSize = size === "md" ? "18" : "14";

	return (
		<button
			className={cn(
				"flex items-center gap-2 cursor-pointer",
				size == "md" ? "py-2 px-4 rounded-xl" : "py-1 px-3 rounded-lg",
				className
			)}
			{...props}
		>
			{Icon && <Icon size={iconSize} />}
			{children}
		</button>

	);

};

export function ButtonText({ children }: { children?: React.ReactNode }) {
	return (
		<p className="text-sm">{children}</p>
	);
};