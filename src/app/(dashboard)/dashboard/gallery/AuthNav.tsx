import { getBaseUrl } from "@/utils/seo";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

function ResetPasswordForm() {

	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState("");

	async function sendResetPasswordEmail() {

		if (!email || email.length === 0) return;

		const supabase = createClient();

		await supabase
			.auth
			.resetPasswordForEmail(email, {
				redirectTo: `${getBaseUrl()}/dashboard/auth/reset-password`
			});

		setIsOpen(false);

	};

	return (

		<div className="space-x-4 flex">

			{
				isOpen && (

					<div className="fixed top-14 right-4 z-[70] bg-neutral-200 border-[1px] border-neutral-300 py-2 px-4 rounded-md">

						<input
							type="text"
							placeholder="your@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="placeholder:text-neutral-600 text-black outline-none border-[1px] border-neutral-200 transition-all duration-150 ease-in-out"
						/>

						<button
							disabled={email.length === 0}
							onClick={sendResetPasswordEmail}
							className="text-black disabled:text-neutral-600 disabled:cursor-not-allowed"
						>
							send email
						</button>

					</div>

				)
			}

			<button
				onClick={() => setIsOpen(prev => !prev)}
				className="text-neutral-500 hover:text-black cursor-pointer"
			>
				reset password
			</button>

		</div>

	)

}

export function AuthNav() {

	return (

		<div className="flex space-x-10">

			<ResetPasswordForm />

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

		</div>

	);

};