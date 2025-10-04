import { useImageZoom } from "@/utils/context/imageZoom";
import { bodoni } from "@/utils/fonts";
import { cn } from "@/utils/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
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

			<div className='h-20 w w-full fixed flex justify-between px-8 pt-8 z-50'>

				<div>
					<p className='text-black font-medium'>Georges Bréhier</p>
				</div>

				<div className='sm:flex hidden space-x-8 text-black font-medium capitalize'>
					{navItems.map((item, idx) => (
						<Link
							href=""
							className={`${idx === 0 && "italic"}`}
							key={idx}
						>
							{item.title}
						</Link>
					))}
				</div>

				<div className='sm:hidden block'>
					<button
						onClick={() => setIsOpen(state => !state)}
						className='capitalize text-black font-medium cursor-pointer w'>
						menu
					</button>
				</div>

			</div>

			<div className={cn(
				"sm:hidden",
				isOpen ? "flex flex-col justify-center" : "hidden",
				"bg-white h-screen w-full fixed z-40 py-20 px-8 space-y-4"
			)}>

				{navItems.map((item, idx) => (

					<div
						key={idx}
						className="w-full"
					>

						<Link
							href=""
							className={cn(
								"capitalize text-3xl",
								idx === 0 ? "text-black" : "text-stone-500 hover:text-black"
							)}
						>
							{item.title}
						</Link>

					</div>

				))}

			</div>

		</>

	);

};