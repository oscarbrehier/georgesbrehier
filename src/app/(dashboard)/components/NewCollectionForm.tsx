import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSections } from "@/utils/supabase/sections";
import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { EditData } from "./CreateItemDialog";
import { CollectionFormState, createCollection } from "../actions/collections";

const initialState = { message: "", error: "" };
const initialForm = {
	sectionId: "",
	collectionTitle: "",
	isDefault: false
};

export function NewCollectionForm({
	onSuccess,
	initialData
}: {
	onSuccess?: () => void;
	initialData?: EditData;
}) {

	const [sections, setSections] = useState<GallerySection[]>([]);
	const [formData, setFormData] = useState(initialForm);

	const [state, formAction, pending] = useActionState<CollectionFormState | undefined, FormData>(createCollection, initialState);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {

		const { name, value, type } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value.toLocaleLowerCase()
		}));

	};

	useEffect(() => {

		(async () => {

			const res = await getSections();
			if (res) setSections(res);

		})();

	}, []);

	const isFormComplete =
		formData.sectionId.trim().length > 0 &&
		formData.collectionTitle.trim().length > 0;

	useEffect(() => {

		if (pending) {
			setFormData(initialForm);
		};

	}, [pending]);

	useEffect(() => {
		if (state?.success && onSuccess) {
			onSuccess?.();
		};
	}, [state?.success, onSuccess]);

	return (

		<form
			className="grid gap-4 w"
			action={formAction}
		>

			<Select
				name="sectionId"
				onValueChange={(value) => {
					setFormData(prev => ({ ...prev, sectionId: value }));
				}}
				value={initialData?.section_id ?? formData.sectionId}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select a section" />
				</SelectTrigger>
				<SelectContent
					id="section"
				>
					<SelectGroup>
						<SelectLabel>Sections</SelectLabel>
						{sections.map((section) => (
							<SelectItem
								key={section.id}
								value={section.id}
							>
								{section.title}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>

			<div className="grid w-full max-w-sm items-center gap-3">
				<Label htmlFor="collectionTitle">Collection Title</Label>
				<Input
					type="text"
					id="collectionTitle"
					name="collectionTitle"
					placeholder="Title"
					value={formData.collectionTitle}
					onChange={handleInputChange}
				/>
			</div>

			<div className="flex items-start gap-3">
				<Checkbox
					id="isDefault"
					name="isDefault"
					checked={formData.isDefault}
					onCheckedChange={(checked) => {
						setFormData(prev => ({ ...prev, isDefault: checked === true }));
					}}
				/>
				<div className="grid gap-2">
					<Label htmlFor="isDefault">Make default</Label>
				</div>
			</div>

			<div className="w-full space-y-2">

				{state?.error && (
					<p className="text-xs text-red-600 text-center">{state.error}</p>
				)}

				{state?.success && (
					<p className="text-xs text-green-600 text-center">{state.message}</p>
				)}

				<Button
					type="submit"
					disabled={!isFormComplete}
					className="w-full"
				>

					{pending ? (
						<Loader2 className="w-5 h-5 text-green-600 animate-spin flex-shrink-0" />
					) : (
						<span className="truncate">
							Create collection{formData.collectionTitle && `: ${formData.collectionTitle}`}
						</span>
					)}

				</Button>

			</div>

		</form>

	);

};