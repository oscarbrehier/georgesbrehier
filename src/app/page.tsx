import { promises as fs } from 'fs';
import path from 'path';
import PageClient from './page_client';

export default async function ArtworksPage() {

	const artworkDir = path.join(process.cwd(), 'public', 'artworkfill');
	let files: string[] = [];
	try {
		files = await fs.readdir(artworkDir);
	} catch (e) {
		console.error('Could not read artwork directory:', e);
	}

	const images = files.filter((f) =>
		['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(f).toLowerCase())
	).slice(0, 3);


	const basePath = "/artworkfill";
	const navItems = [
		{ path: "", title: "lampes" },
		{ path: "", title: "peintures" },
		{ path: "", title: "sculptures" },
	];

	return (
		<PageClient
			basePath={basePath}
			navItems={navItems}
			images={images}
		/>
	);
}
