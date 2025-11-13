import { LogOut } from "lucide-react";

export function LogOutBtn() {

	return (

		<form
			action="/api/auth/signout"
			method="POST"
			className="">

			<button
				className="text-neutral-500 hover:text-black cursor-pointer"
				type="submit"
			>
				log out
			</button>

		</form>

	);

};