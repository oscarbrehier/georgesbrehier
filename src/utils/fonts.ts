import { Bodoni_Moda, Roboto } from "next/font/google";

export const bodoni = Bodoni_Moda({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	display: "swap",
});

export const roboto = Roboto({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	display: "swap",
});