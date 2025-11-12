"use client"

import { Input } from "@/components/dashboard/Input";
import { Select } from "@/components/dashboard/Select";
import { Key } from "lucide-react";
import { useState } from "react";

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
	data
}: {
	collection: string,
	data: GalleryCollectionSEO
}) {

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

	function handleSubmit() {

		const formData = new FormData();
		
		Object.entries(seo).forEach(([Key, value]) => {
		
			if (value !== undefined) {
				formData.append(Key, value);
			};
		
		});

		console.log(formData.get('seo_title'))

	};

	return (

		<div className="flex-1 w-full pt-10 flex items-center flex-col space-y-16">

			<div className="space-y-3">
				<p className="text-5xl text-black">SEO Settings ({collection})</p>
				<p className="text-neutral-500">Manage search engine optimization and social media metadata</p>
			</div>

			<div className="w-1/2 space-y-8">

				<p className="text-black text-3xl">Basic Information</p>

				<div className="w-full flex flex-col space-y-8">

					<Input
						id="title"
						label="Title"
						sublabel={`Current length: ${seo.seo_title.length} characters`}
						placeholder="Enter page title (50-60 characters recommended)"
						value={seo.seo_title}
						onChange={(e) => handleChange("seo_title", e.target.value)}
					/>

					<Input
						id="description"
						label="Description"
						sublabel={`Current length: ${seo.seo_description.length} characters`}
						placeholder="Enter meta description (150-160 characters recommended)"
						value={seo.seo_description}
						onChange={(e) => handleChange("seo_description", e.target.value)}
					/>

					<Select
						label="Robots Meta Tag"
						id="robot_meta_tag"
						options={[
							{ title: "index, follow" },
							{ title: "index, nofollow" },
							{ title: "noindex, follow" },
							{ title: "noindex, nofollow" },
						]}
						value={seo.seo_robots}
						onChange={(e) => handleChange("seo_robots", e.target.value)}
					/>

					<Input
						id="canonical_url"
						label="Canonical URL (Optional)"
						placeholder="https://example.com/page"
						value={seo.seo_canonical_url ?? ""}
						onChange={(e) => handleChange("seo_canonical_url", e.target.value)}
					/>

				</div>

			</div>

			<div className="w-1/2 space-y-8">

				<p className="text-black text-3xl">Open Graph (Facebook, LinkedIn)</p>

				<div className="w-full flex flex-col space-y-8">

					<Input
						id="og_image_url"
						label="Image URL"
						placeholder="https://example.com/image.jpg"
						value={seo.seo_og_image_url}
						onChange={(e) => handleChange("seo_og_image_url", e.target.value)}
					/>

					<div className="grid grid-cols-2 gap-2">

						<Input
							id="og_image_width"
							label="Image Width (px)"
							value={seo.seo_og_image_width}
							onChange={(e) => handleChange("seo_og_image_width", e.target.value)}
						/>

						<Input
							id="og_image_height"
							label="Image Height (px)"
							value={seo.seo_og_image_height}
							onChange={(e) => handleChange("seo_og_image_height", e.target.value)}
						/>

					</div>

					<Input
						id="og_image_alt"
						label="Image Alt Text"
						placeholder="Describe the image for accessibility"
						value={seo.seo_og_image_alt}
						onChange={(e) => handleChange("seo_og_image_alt", e.target.value)}
					/>

				</div>

			</div>

			<div className="w-1/2 space-y-8">

				<p className="text-black text-3xl">Twitter / X</p>

				<div className="w-full flex flex-col space-y-8">

					<Input
						id="seo_twitter_image_url"
						label="Image URL"
						placeholder="https://example.com/twitter-image.jpg"
						value={seo.seo_twitter_image_url}
						onChange={(e) => handleChange("seo_twitter_image_url", e.target.value)}
					/>

					<Select
						label="Card Type"
						id="twitter_image_type"
						options={[
							{ title: "summary", value: "summary" },
							{ title: "summary large image", value: "summary_large_image" },
							{ title: "app", value: "app" },
						]}
						value={seo.seo_twitter_image_type}
						onChange={(e) => handleChange("seo_twitter_image_type", e.target.value)}
						sublabel={
							{
								summary: "Small card with image on the side",
								summary_large_image: "Large card with full-width image",
								app: "Card optimized for app links",
							}[seo.seo_twitter_image_type] ?? ""
						}
					/>

				</div>

			</div>

			<button
				onClick={handleSubmit}
				className="bg-neutral-900 text-white w-1/2 py-3 rounded-md cursor-pointer"
			>
				Save changes
			</button>

		</div>

	);

};