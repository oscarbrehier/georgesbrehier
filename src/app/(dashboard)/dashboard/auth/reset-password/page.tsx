"use client"

import { Input } from "@/components/dashboard/Input";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {

	const router = useRouter();

	const [error, setError] = useState<string | null>(null);
	const [form, setForm] = useState({
		password: "",
		confirmPassword: ""
	});

	async function handleReset() {

		setError(null);

		if (!form.password || !form.confirmPassword) return;
		if (form.password !== form.confirmPassword) {

			setError("Passwords do not match");
			return;

		};

		const supabase = createClient();

		const { error } = await supabase.auth.updateUser({ password: form.password });

		if (error) {
			console.error(error)
			setError("An error occurred. Please try again.");
			return;
		};

		await supabase.auth.signOut();

		router.push("/dashboard/auth/login");

	};

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
					value={form.password}
					onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
				/>

				<Input
					id="confirm_password"
					label="Confirm new password"
					type="password"
					value={form.confirmPassword}
					onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
				/>

				{error && (
					<div className="p-4 rounded-lg bg-red-50 border border-red-200 mt-2">
						<p className="text-sm text-red-600">{error}</p>
					</div>
				)}

				<button
					onClick={handleReset}
					className="w-full py-3 px-6 rounded-lg bg-neutral-900 text-white font-medium transition-all duration-200 hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					Submit
				</button>

			</div>

		</div>

	);

};