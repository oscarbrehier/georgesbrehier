"use client"

import { updateSEO } from "@/app/actions/updateSEO";
import { Input } from "@/components/dashboard/Input";
import { Select } from "@/components/dashboard/Select";
import { cn } from "@/utils/utils";
import { ArrowLeft, Images, Key } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageGallery } from "./ImageGallery";
import { roboto } from "@/utils/fonts";
import { SeoForm } from "./SeoForm";
import { SeoPreview } from "./Preview";

const defaultSEO: GalleryCollectionSEO = {
	seo_title: "",
	seo_description: "",
	seo_og_image_url: "",
	seo_og_image_width: 1200,
	seo_og_image_height: 630,
	seo_og_image_alt: "",
	seo_twitter_image_url: "",
	seo_twitter_image_type: "summary_large_image",
	seo_canonical_url: null,
	seo_robots: "index, follow",
}

export function SeoEditor({
	collection,
	imageGallery,
	data
}: {
	collection: string,
	imageGallery: GalleryItem[],
	data: GalleryCollectionSEO
}) {

	const [isLoading, setIsLoading] = useState(false);
	const [isPanelOpen, setIsPanelOpen] = useState(false);

	const [seo, setSEO] = useState<GalleryCollectionSEO>({
		...defaultSEO,
		...data,
		seo_title: data.seo_title ?? "",
		seo_description: data.seo_description ?? "",
		seo_og_image_url: data.seo_og_image_url ?? "",
		seo_og_image_alt: data.seo_og_image_alt ?? "",
		seo_twitter_image_url: data.seo_twitter_image_url ?? "",
	});

	function handleChange(field: keyof GalleryCollectionSEO, value: any) {

		setSEO((prev) => ({
			...prev,
			[field]: value,
		}));

	};

	async function handleSubmit() {

		setIsLoading(true);

		try {

			const result = await updateSEO(collection, seo);

			if (result?.error) {

				console.log(result.error)

			};

		} finally {
			setIsLoading(false);
		};

	};

	return (

		<div className={cn(
			"h-auto min-h-screen w-full pt-10",
		)}>

			<div className={cn(
				"w-full space-y-3 transition-all duration-300 ease-in-out text-center mb-14"
			)}>
				<p className="text-5xl text-black">SEO Settings ({collection})</p>
				<p className="text-neutral-500">Manage search engine optimization and social media metadata</p>
			</div>

			{isPanelOpen ? (

				<div className="flex flex-col items-end space-y-4">

					<button
						onClick={() => setIsPanelOpen(false)}
						className="text-neutral-900 flex bg-neutral-200 rounded-md py-2 px-3 space-x-2 cursor-pointer"
					>
						<ArrowLeft />
						<span>Back to form</span>
					</button>

					<div className="w-full grid grid-cols-2 gap-4">

						<ImageGallery
							images={imageGallery}
							onSelect={(e) => handleChange("seo_og_image_url", e.image_url)}
						/>

						<SeoPreview seo={seo} />

					</div>

				</div>

			) : (

				<SeoForm
					collection={collection}
					seo={seo}
					handleChange={handleChange}
					onSubmit={handleSubmit}
					onPanelOpen={() => setIsPanelOpen(true)}
				/>

			)}

		</div>

	);

};