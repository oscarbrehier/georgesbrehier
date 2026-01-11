import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {

	let response = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {

					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
					response = NextResponse.next({
						request,
					});

					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options)
					);

				}
			}
		}
	);


	const pathname = request.nextUrl.pathname;
	const isAdminRoute = pathname.startsWith("/dashboard");

	if (!isAdminRoute) return response;

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (
		!user &&
		!pathname.startsWith('/dashboard/auth/login') &&
		!pathname.startsWith('/dashboard/auth') &&
		!pathname.startsWith('/dashboard/error')
	) {

		const url = request.nextUrl.clone();
		url.pathname = "/dashboard/auth/login";

		return NextResponse.redirect(url);

	};

	return response;

};