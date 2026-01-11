'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type LoginResult = {
	error?: string | null
};

export async function login(prevState: any, formData: FormData): Promise<LoginResult> {

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
	redirect("/dashboard/gallery");

};