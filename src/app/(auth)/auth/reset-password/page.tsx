"use client"

import { Input } from "@/components/dashboard/Input";
import { useActionState } from "react";
import { resetPassword } from "../actions";

export default function Page() {

	const [state, action, isPending] = useActionState(resetPassword, null);

	return (

		<div className="h-screen w-full p-8 flex justify-center items-center flex-col">

			<div className="w-full space-y-3 transition-all duration-300 ease-in-out text-center mb-14">
				<p className="text-5xl text-black">Reset password</p>
			</div>

			<div
				className="w-full max-w-2xl space-y-4"
			>

				<Input
					id="password"
					label="New password"
					type="password"
				/>

				<Input
					id="confirm_password"
					label="Confirm new password"
					type="password"
				/>

				{state?.error && (
					<div className="p-4 rounded-lg bg-red-50 border border-red-200 mt-2">
						<p className="text-sm text-red-600">{state?.error}</p>
					</div>
				)}

				<button
					formAction={action}
					className="w-full py-3 px-6 rounded-lg bg-neutral-900 text-white font-medium transition-all duration-200 hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					disabled={isPending}
				>
					Submit
				</button>

			</div>

		</div>

	);

};