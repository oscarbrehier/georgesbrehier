"use client"

import { useActionState } from "react";
import { login } from "../actions";
import { Loader2 } from "lucide-react";

export default function Page() {

	const [state, loginAction, isPending] = useActionState(login, null);

	return (

		<div className="h-screen w-full flex flex-col items-center justify-center">

			<div className="space-y-1">

				<p className="text-neutral-800 text-md underline">Authenticate</p>

				<form
					className="flex space-x-2"
				>

					<input
						name="email"
						className="bg-neutral-200 h-14 px-6 rounded-md text-neutral-800 placehoder:text-neutral-800 text-xl outline-none"
						placeholder="Email"
						type="email"
						required
					/>

					<input
						name="password"
						className="bg-neutral-200 h-14 px-6 rounded-md text-neutral-800 placehoder:text-neutral-800 text-xl outline-none"
						placeholder="Password"
						type="password"
						required
					/>

					<button
						className="bg-neutral-400 disabled:bg-neutral-200 h-14 px-6 rounded-md text-neutral-50 disabled:text-neutral-500 text-lg cursor-pointer"
						formAction={loginAction}
						disabled={isPending}
					>
						{
							isPending ? (
								<Loader2 className="animate-spin shrink-0" />
							) : (
								<span>Log in</span>
							)
						}
					</button>

				</form>

				{state?.error && (
					<div className="mt-6 flex justify-center">
						<p className="text-destructive">{state?.error}</p>
					</div>
				)}
				
			</div>

		</div>

	);

};