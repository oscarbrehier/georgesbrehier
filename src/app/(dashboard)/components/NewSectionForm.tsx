import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createSection, SectionFormState } from "../actions/createSection";


const initialState = { message: "", error: "" };
const initialForm = {
	sectionTitle: "",
	isDefault: false
};

export function NewSectionForm({
	onSuccess
}: {
	onSuccess?: () => void;
}) {

	const [formData, setFormData] = useState(initialForm);

	const [state, formAction, pending] = useActionState<SectionFormState | undefined, FormData>(createSection, initialState);
	const isFormComplete = formData.sectionTitle.trim().length > 0;

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
		if (state?.success && onSuccess) {
			onSuccess?.();
		};
	}, [state?.success, onSuccess]);

	return (

		<form
			className="grid gap-4 w"
			action={formAction}
		>

			<div className="grid w-full max-w-sm items-center gap-3">
				<Label htmlFor="sectionTitle">Section Title</Label>
				<Input
					type="text"
					id="sectionTitle"
					name="sectionTitle"
					placeholder="Title"
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
							Create section{formData.sectionTitle && `: ${formData.sectionTitle}`}
						</span>
					)}

				</Button>

			</div>

		</form>

	);

};