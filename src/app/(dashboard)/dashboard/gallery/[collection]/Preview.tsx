import { roboto } from "@/utils/fonts";
import { cn } from "@/utils/utils";

export function SeoPreview({
	seo
}: {
	seo: GalleryCollectionSEO
}) {

	return (

		<div className="w-full">

			<p className="text-black text-3xl mb-8">Preview</p>

			<div className="space-y-4">

				<div className="rounded-md border border-neutral-200 p-4">

					<p className="text-xs text-neutral-500 www mb-1">GOOGLE SEARCH</p>

					<div>

						<p className="text-sm text-neutral-900 font-semibold truncate">{seo.seo_title || "Your page title"}</p>

						<p className="text-xs text-neutral-500 truncate mt-0.5 w">
							{seo.seo_canonical_url || "https://example.com"}
						</p>

						<p className="text-sm text-neutral-500 line-clamp-2 mt-1">
							{seo.seo_description || "Your meta description will appear here"}
						</p>

					</div>

				</div>

			</div>

			<div className="max-w-md mt-4">

				<div className="bg-neutral-200 w rounded-md overflow-hidden">

					{seo.seo_og_image_url && (

						<div className="w-full aspect-[1200/630]">
							<img
								src={seo.seo_og_image_url}
								alt="Social preview"
								className="w-full h-full object-cover"
							/>
						</div>

					)}

					<div className="px-4 py-2">

						<p className="mt-2 text-xs text-neutral-500">{new URL(seo.seo_canonical_url || "https://example.com").hostname}</p>

						<h3 className={cn("font-semibold text-lg truncate text-neutral-900", roboto.className)}>
							{seo.seo_title || "Your Page Title Goes Here"}
						</h3>
						<p className="text-sm line-clamp-3 text-neutral-500">
							{seo.seo_description || "This is the description text that will show in the social preview card. It can wrap up to 3 lines."}
						</p>


					</div>

				</div>

			</div>

		</div>

	);

};