export function capitalize(str: string) {
	if (!str) return null;
	return str.charAt(0).toUpperCase() + str.slice(1);
};