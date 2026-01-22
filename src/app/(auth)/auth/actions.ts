'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AuthResult = {
	error?: string | null
};

export async function login(prevState: any, formData: FormData): Promise<AuthResult> {

	const supabase = await createClient();

	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string
	};

	const { error } = await supabase
		.auth
		.signInWithPassword(data);

	if (error) {
		return { error: error.message }
	};

	revalidatePath("/dashboard", "layout");
	redirect("/dashboard/sections");

};

export async function resetPassword(prevState: any, formData: FormData): Promise<AuthResult> {

	const data = {
		password: formData.get("password") as string,
		confirmPassword: formData.get("confirmPassword") as string
	};

	if (data.password !== data.confirmPassword) {
		return {
			error: "Passwords do not match."
		};
	};

	const supabase = await createClient();

	const { error } = await supabase.auth.updateUser({ password: data.password });

	if (error) {
		return { error: error.message };
	};

	await supabase.auth.signOut();

	redirect("/auth/login");

};