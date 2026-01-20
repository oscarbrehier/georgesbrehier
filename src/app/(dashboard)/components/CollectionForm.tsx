import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSections } from "@/utils/supabase/sections";
import { FormEvent, useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { EditData } from "./CreateItemDialog";
import { CollectionFormState, createCollection, updateCollection } from "../actions/collections";

interface FormState {
	message?: string;
	error?: string | null;
	success?: boolean;
};

const initialState = { message: "", error: "" };
const initialForm = {
	sectionId: "",
	collectionTitle: "",
	isDefault: false
};

export function CollectionForm({
	onSuccess,
	initialData
}: {
	onSuccess?: () => void;
	initialData?: EditData;
}) {

	const isEditMode = !!initialData;

	const [sections, setSections] = useState<GallerySection[]>([]);
	const [formData, setFormData] = useState({
		sectionId: initialData?.section_id ?? "",
		collectionTitle: initialData?.title ?? "",
		isDefault: initialData?.is_default ?? false,
	});

	const [formState, setFormState] = useState<FormState>({});
	const [pending, setPending] = useState(false);

	async function handleSubmit(e: FormEvent) {

		e.preventDefault();
		if (pending) setPending(false);
		setPending(true);

		if (isEditMode) {

			const { error } = await updateCollection(initialData.id, {
				title: formData.collectionTitle,
				is_default: formData.isDefault
			});

			setFormState({ error, success: !error, message: !error ? "Updated!" : "" });

		} else {

			const res = await createCollection({
				sectionId: formData.sectionId,
				title: formData.collectionTitle,
				is_default: formData.isDefault,
			});

			setFormState(res);

		};

		setPending(false);

	};

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
		if (formState.success && onSuccess) {
			onSuccess?.();
		};
	}, [formState.success, onSuccess]);

	return (

		<form
			className="grid gap-4 w"
			onSubmit={handleSubmit}
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

				{formState?.error && (
					<p className="text-xs text-red-600 text-center">{formState.error}</p>
				)}

				{formState?.success && (
					<p className="text-xs text-green-600 text-center">{formState.message}</p>
				)}

				<Button
					type="submit"
					disabled={!isFormComplete}
					className="w-full"
				>

					{pending ? (
						<Loader2 className="w-5 h-5 text-green-600 animate-spin shrink-0" />
					) : (
						<span className="truncate">
							{isEditMode
								? "Update collection"
								: `Create collection${formData.collectionTitle && `: ${formData.collectionTitle}`}`
							}
						</span>
					)}

				</Button>

			</div>

		</form>

	);

};