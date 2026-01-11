import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getDefaultSection } from './utils/supabase/sections'
import { updateSession } from './utils/supabase/middleware'
import { getDefaultCollectionBySectionId } from './utils/supabase/collections';

export async function proxy(request: NextRequest) {

	const response = await updateSession(request);

	const { pathname } = request.nextUrl;

	if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
		return response;
	};

	if (pathname === '/') {

		try {

			const defaultSection = await getDefaultSection();
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

			const section = await getDefaultSection();

			if (section && section.slug === sectionSlug) {

				const defaultCollection = await getDefaultCollectionBySectionId(section.id);
				if (defaultCollection?.slug) {
					return NextResponse.redirect(new URL(`/${sectionSlug}/${defaultCollection.slug}`, request.url));
				};

			};

		} catch (error) {
			console.error('Error redirecting from section:', error);
		};

	};

	return response;

};

export const config = {
	matcher: ['/((?!api|_next|.*\\..*).*)']
};