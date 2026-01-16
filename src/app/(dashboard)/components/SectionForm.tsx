import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createSection, updateSection } from "../actions/sections";
import { EditData } from "./CreateItemDialog";

interface FormState {
	message?: string;
	error?: string | null;
	success?: boolean;
};

const initialForm = {
	sectionTitle: "",
	isDefault: false
};

export function SectionForm({
	onSuccess,
	initialData,
}: {
	onSuccess?: () => void;
	initialData?: EditData;
}) {

	const isEditMode = !!initialData;

	const [formData, setFormData] = useState({
		sectionTitle: "",
		isDefault: initialData?.is_default || false
	});

	const [formState, setFormState] = useState<FormState>({});
	const [pending, setPending] = useState(false);

	const isFormComplete = formData.sectionTitle.trim().length > 0;

	async function handleSubmit(e: FormEvent) {

		e.preventDefault();
		if (pending) return;
		setPending(true);

		if (isEditMode) {

			const { error } = await updateSection(initialData.id, {
				title: formData.sectionTitle,
				is_default: formData.isDefault
			});

			setFormState({ error, success: !error, message: !error ? "Updated!" : "" });

		} else {

			const res = await createSection({
				title: formData.sectionTitle,
				is_default: formData.isDefault
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
			className="grid gap-4"
			onSubmit={handleSubmit}
		>

			<div className="grid w-full max-w-sm items-center gap-3">
				<Label htmlFor="sectionTitle">Title</Label>
				<Input
					type="text"
					id="sectionTitle"
					name="sectionTitle"
					placeholder={isEditMode ? initialData.title : "Title"}
					value={formData.sectionTitle}
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
					<Label htmlFor="isDefault">Default</Label>
				</div>
			</div>

			<div className="w-full space-y-2">

				{formState.error && (
					<p className="text-xs text-red-600 text-center">{formState.error}</p>
				)}

				{formState.success && (
					<p className="text-xs text-green-600 text-center">{formState.message}</p>
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
							{isEditMode
								? "Update section"
								: `Create section${formData.sectionTitle && `: ${formData.sectionTitle}`}`
							}
						</span>
					)}

				</Button>

			</div>

		</form>

	);

};