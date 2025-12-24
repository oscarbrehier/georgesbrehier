export function getBaseUrl(): string {

	if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL) {
		return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
	};

	return '';
	
};

export function getFullUrl(path: string): string {

	const baseUrl = getBaseUrl();
	const cleanPath = path.startsWith('/') ? path : `/${path}`;

	return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;

};

export const baseSeo = {
	name: "Georges Bréhier",
	description: ""
};

