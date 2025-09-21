"use client"

import ArtworksScroll from '@/components/ArtworkScroll';
import { CursorFollow } from '@/components/CursorFollow';
import { useState } from 'react';

export default function PageClient({
	navItems,
	basePath,
	images
}: {
	basePath: string,
	images: string[],
	navItems: { path: string, title: string }[],
}) {

	const [isAtTop, setIsAtTop] = useState(true);

	return (
		<div className="h-auto w-full">

			<CursorFollow
				hideOnScroll={!isAtTop}
			/>

			<div className='h-auto w-full fixed top-8 left-8 text-black'>

				<p className='font-medium text-lg mb-8'>Georges Bréhier</p>

				<ul className=''>
					{navItems.map((item, idx) => (
						<li key={idx}>
							<a href={item.path} className='capitalize'>
								{item.title}
							</a>
						</li>
					))}
				</ul>

			</div>

			<ArtworksScroll
				images={images}
				basePath={basePath}
				titles={[
					"title1",
					"title2",
					"title3"
				]}
				onScrollChange={setIsAtTop}
			/>

		</div>

	);

};