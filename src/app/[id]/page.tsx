import Image from "next/image";

import { Bodoni_Moda } from "next/font/google";

const bodoni = Bodoni_Moda({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"], // optional if you want italics too
	display: "swap",
});

export default async function Page({
	params
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params;

	return (
		<div className="h-screen w-full flex font-mono">
			<div className="h-screen relative w-2/3">
				<Image
					src={`/artwork/${id}`}
					alt={id}
					fill
					loading="lazy"
					className="object-contain" // keeps aspect ratio, no distortion
				/>
			</div>
			<div className="h-screen flex flex-col justify-end w-1/3 pb-20">
				<p className={`${bodoni.className} text-black text-6xl capitalize font-medium`}>
					title
				</p>
				<p className={`text-black text-xl capitalize font-medium`}>
					110cm x 152cm
				</p>
			</div>
		</div>
	);

};