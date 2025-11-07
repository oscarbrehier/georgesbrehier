import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function proxy(request: NextRequest) {

	const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard");
	if (!isAdminRoute) return NextResponse.next();

	return await updateSession(request);

};

export const config = {
	matcher: [
		'/((?!api/gallery/upload|_next/static|_next/image|favicon.ico).*)',
	],
};