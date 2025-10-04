import { useImageZoom } from "@/utils/context/imageZoom";
import { bodoni } from "@/utils/fonts";
import { cn } from "@/utils/utils";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Navbar({
	navItems
}: {
	navItems: { path: string, title: string }[]
}) {

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { style } = useImageZoom();

	return (

		<>

			<div className={cn("h-auto w-full fixed text-black transition-all duration-300 ease-in-out top-8 left-8 lg:block hidden e")} style={style}>

				<p className='font-medium text-lg mb-8'>Georges Bréhier</p>

				<ul className=''>
					{navItems.map((item, idx) => (
						<li key={idx}>
							<a href={item.path} className='capitalize'>
								{item.title}
							</a>
						</li>
					))}
				</ul>

			</div>

			<button
				onClick={() => setIsOpen(state => !state)}
				className="lg:hidden inline-flex fixed top-8 right-8 size-auto items-center justify-center cursor-pointer z-50"
			>
				<Menu className="block text-black" size={30} strokeWidth={1.5} />
			</button>

			<div className={cn(
				"h-screen w-screen bg-white fixed z-40 items-center justify-center transition-all ease-in-out duration-75",
				isOpen ? "flex" : "hidden"
			)}>

				<ul className='space-y-4 w'>
					{navItems.map((item, idx) => (
						<li key={idx}>
							<a href={item.path} className={cn("capitalize text-3xl transition-all ease-in-out", idx === 0 ? `text-black` : "text-stone-500 hover:text-black")}>
								{item.title}
							</a>
						</li>
					))}
				</ul>

			</div>

		</>

	);

};