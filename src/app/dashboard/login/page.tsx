"use client"

import { authenticateAdmin } from "@/app/actions/authenticateAdmin";
import { useState } from "react";
import { login } from "./actions";

export default function Page() {

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
						className="bg-neutral-400 disabled:bg-neutral-200 h-14 px-6 rounded-md text-neutral-200 disabled:text-neutral-300 text-lg cursor-pointer"
						formAction={login}
					>
						Log in
					</button>

				</form>

			</div>

		</div>

	);

};