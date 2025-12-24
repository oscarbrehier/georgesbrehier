import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCachedDefaultSection } from './utils/supabase/sections'
import { getCachedDefaultCollection } from './utils/supabase/collections'
import { updateSession } from './utils/supabase/middleware'

export async function proxy(request: NextRequest) {

	const { pathname } = request.nextUrl;
	const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard");

	if (isAdminRoute) return await updateSession(request);

	if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
		return NextResponse.next();
	};

	if (pathname === '/') {

		try {

			const defaultSection = await getCachedDefaultSection();
			if (defaultSection?.slug) {
				return NextResponse.redirect(new URL(`/${defaultSection.slug}`, request.url));
			};

		} catch (error) {
			console.error('Error redirecting from root:', error);
		};

	};

	const sectionMatch = pathname.match(/^\/([^\/]+)$/);
	if (sectionMatch && !pathname.includes('.')) {

		const sectionSlug = sectionMatch[1];

		try {

			const section = await getCachedDefaultSection();

			if (section && section.slug === sectionSlug) {

				const defaultCollection = await getCachedDefaultCollection(section.id);
				if (defaultCollection?.slug) {
					return NextResponse.redirect(new URL(`/${sectionSlug}/${defaultCollection.slug}`, request.url));
				};

			};

		} catch (error) {
			console.error('Error redirecting from section:', error);
		};

	};

	return NextResponse.next();

};

export const config = {
	matcher: [
		'/',
		'/dashboard/:path*',
		'/:section',
		'/:section/:collection',
	]
};