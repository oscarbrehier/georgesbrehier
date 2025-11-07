import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

	const form = await req.formData();
	const password = form.get("password");

	if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ success: false, error: "Passwords don\'t match" }, { status: 401 })

	const cookieStore = await cookies();
	cookieStore.set("admin_auth", "true", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/"
	});

	return NextResponse.redirect(new URL("/admin/gallery", req.url));

};