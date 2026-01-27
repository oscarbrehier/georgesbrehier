import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UI_LABELS } from "@/utils/constants";
import { CreateItemDialog } from "../../components/dialog/CreateItemDialog";
import { UploadFormData } from "@/stores/useUploadForm";
import { getSections } from "@/utils/supabase/sections";
import { getCollectionsBySection } from "@/utils/supabase/collections";

export function UploadDestionation({
	formData,
	onChange,
	sections,
	onSectionsChange,
	collections,
	onCollectionsChange,
}: {
	formData: UploadFormData;
	onChange: (sectionId: string, collectionId: string) => void;
	sections: GallerySection[];
	onSectionsChange: (sections: GallerySection[]) => void;
	collections: GalleryCollection[] | null;
	onCollectionsChange: (collections: GalleryCollection[]) => void;
}) {

	return (

		<div className="rounded-lg border border-border bg-dashboard p-6">

			<h2 className="mb-4 text-sm font-medium text-foreground">
				Upload Destination
			</h2>

			<div className="grid gap-6 sm:grid-cols-2">

				<div className="space-y-2">

					<Label htmlFor="section" className="text-muted-foreground">
						{UI_LABELS.section.capitalized}
					</Label>

					<Select
						value={formData.sectionId}
						onValueChange={(id) => onChange(id, "")}
					>
						<SelectTrigger id="section" className="bg-input">
							<SelectValue placeholder="Select a section" />
						</SelectTrigger>
						<SelectContent>
							{sections.map((section) => (
								<SelectItem key={section.id} value={section.id}>
									{section.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<CreateItemDialog
						type="section"
						onSuccess={async () => {
							const sectionsRes = await getSections();
							onSectionsChange(sectionsRes);
						}}
					>
						<button
							type="button"
							className="text-neutral-600 text-xs mt-1.5 underline cursor-pointer"
						>
							Create a new {UI_LABELS.section.singular}
						</button>
					</CreateItemDialog>

				</div>

				<div className="space-y-2">

					<Label htmlFor="subsection" className="text-muted-foreground">
						{UI_LABELS.collection.capitalized}
					</Label>

					<Select
						value={formData.collectionId}
						onValueChange={(id) => onChange(formData.sectionId, id)}
						disabled={!formData.sectionId}
					>
						<SelectTrigger id="subsection" className="bg-input">
							<SelectValue
								placeholder={
									formData.sectionId
										? `Select a ${UI_LABELS.collection.singular}`
										: `Select a ${UI_LABELS.section.singular} first`
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{collections?.map((collection) => (
								<SelectItem key={collection.id} value={collection.id}>
									{collection.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<CreateItemDialog
						type="collection"
						onSuccess={async () => {
							if (formData.sectionId) {
								const collectionRes = await getCollectionsBySection(formData.sectionId);
								onCollectionsChange(collectionRes);
							}
						}}
					>

						<button
							type="button"
							className="text-neutral-600 text-xs mt-1.5 underline cursor-pointer"
						>
							Create a new {UI_LABELS.collection.singular}
						</button>

					</CreateItemDialog>

				</div>
			</div>
		</div>

	)

};