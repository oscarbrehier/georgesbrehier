'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authenticateAdmin(formData: FormData) {

	const password = formData.get("password");

	console.log(password);
	console.log(process.env.ADMIN_PASSWORD);

	if (password !== process.env.ADMIN_PASSWORD) {
		redirect("/admin/verify?error=1");
	};

	const cookieStore = await cookies();
	cookieStore.set("admin_auth", "true", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/"
	});

	redirect("/admin/gallery");

};