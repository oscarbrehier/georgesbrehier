"use client"

import { LogOut, Settings, UserPen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SignOutBtn() {

	const [isModalOpen, setIsModalOpen] = useState(false);

	const modalRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {

		function handleClickOutside(event: MouseEvent) {

			const target = event.target as Node;

			if (
				modalRef.current &&
				!modalRef.current.contains(target) &&
				buttonRef.current &&
				!buttonRef.current.contains(target)
			) {
				setIsModalOpen(false);
			};

		};

		if (isModalOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		};

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};

	}, [isModalOpen]);

	return (

		<div
			className="absolute bottom-4 right-4 flex flex-col items-end space-y-2"
		>

			{
				isModalOpen && (

					<div ref={modalRef} className="bg-neutral-900 rounded-xl p-2">

						<div className="min-w-32 pr-8 hover:bg-neutral-800 rounded-lg p-2 cursor-pointer flex items-center space-x-2">

							<UserPen size={16} />

							<button
								className="text-sm font-medium"
							>
								Change password
							</button>

						</div>

						<form
							action="/api/auth/signout"
							method="POST" 
							className="min-w-32 pr-8 hover:bg-neutral-800 rounded-lg p-2 cursor-pointer flex items-center space-x-2">

							<LogOut size={16} />

							<button
								className="text-sm font-medium"
								type="submit"
							>
								Log out
							</button>

						</form>

					</div>

				)
			}

			<button
				ref={buttonRef}
				title="Settings"
				className=" p-3 bg-neutral-900 rounded-full cursor-pointer"
				onClick={() => setIsModalOpen(state => !state)}
			>
				<Settings
					className="text-neutral-200"
					size={18}
				/>
			</button>

		</div>

	);

};