import { Input } from "@/components/dashboard/Input";
import { Select } from "@/components/dashboard/Select";
import { cn } from "@/utils/utils";

export function SeoForm({
	collection,
	seo,
	handleChange,
	onSubmit,
	onPanelOpen,
}: {
	collection: string;
	seo: GalleryCollectionSEO;
	handleChange: (field: keyof GalleryCollectionSEO, value: any) => void;
	onSubmit: () => void;
	onPanelOpen: () => void;
}) {

	return (

		<div className="w-full flex justify-center pb-10">

			<div className={cn(
				"w-full max-w-4xl flex items-center flex-col space-y-16 transition-all duration-300 ease-in-out",
			)}>

				<div className="w-full space-y-8">

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
							value={seo.seo_robots}
							onChange={(e) => handleChange("seo_robots", e.target.value)}
						>
							{["index, follow", "index, nofollow", "noindex, follow", "noindex, nofollow"]
								.map((item, idx) => (

								<option
									key={idx}
									value={item}
								>
									{item}
								</option>

							))}
						</Select>

						<Input
							id="canonical_url"
							label="Canonical URL (Optional)"
							placeholder="https://example.com/page"
							value={seo.seo_canonical_url ?? ""}
							onChange={(e) => handleChange("seo_canonical_url", e.target.value)}
						/>

					</div>

				</div>

				<div className="w-full space-y-8">

					<p className="text-black text-3xl">Open Graph (Facebook, LinkedIn)</p>

					<div className="w-full flex flex-col space-y-8">

						<div className="w-full flex space-y-4">

							<Input
								className="w-full"
								id="og_image_url"
								label="Image URL"
								placeholder="https://example.com/image.jpg"
								value={seo.seo_og_image_url}
								onChange={(e) => handleChange("seo_og_image_url", e.target.value)}
								sublabel={
									<button
										className="underline cursor-pointer"
										onClick={() => {

											window.scrollTo({ top: 0, behavior: "smooth" })
											onPanelOpen();

										}}
									>
										Select from image gallery
									</button>
								}
							/>

						</div>

						<div className="grid grid-cols-2 gap-2">

							<Input
								id="og_image_width"
								type="number"
								label="Image Width (px)"
								value={seo.seo_og_image_width}
								onChange={(e) => handleChange("seo_og_image_width", e.target.value)}
							/>

							<Input
								id="og_image_height"
								type="number"
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

				<div className="w-full space-y-8">

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
							value={seo.seo_twitter_image_type}
							onChange={(e) => handleChange("seo_twitter_image_type", e.target.value)}
							sublabel={
								{
									summary: "Small card with image on the side",
									summary_large_image: "Large card with full-width image",
									app: "Card optimized for app links",
								}[seo.seo_twitter_image_type] ?? ""
							}
						>
					
							{[
								{ title: "summary", value: "summary" },
								{ title: "summary large image", value: "summary_large_image" },
								{ title: "app", value: "app" },
							].map((item, idx) => (

								<option key={idx} value={item.value}>
									{item.title}
								</option>

							))}

						</Select>

					</div>

				</div>

				<button
					onClick={onSubmit}
					className="bg-neutral-900 text-white w-full py-3 rounded-md cursor-pointer"
				>
					Save changes
				</button>

			</div>

		</div>

	);

};