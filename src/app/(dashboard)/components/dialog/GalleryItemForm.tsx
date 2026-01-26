import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSections } from "@/utils/supabase/sections";
import { FormEvent, useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { EditData } from "./CreateItemDialog";
import { createCollection, updateCollection } from "../../actions/collections";
import { UI_LABELS } from "@/utils/constants";
import { Textarea } from "@/components/ui/textarea";
import { updateGalleryItem } from "../../actions/gallery";
import { useRouter } from "next/navigation";

interface FormState {
	message?: string;
	error?: string | null;
	success?: boolean;
};

const initialForm = {
	title: "",
	image_url: "",
	description: "",
	width: 0,
	height: 0,
};

export function GalleryItemForm({
	onSuccess,
	data
}: {
	onSuccess?: () => void;
	data: {
		id: string;
		collectionId: string;
		title: string;
		image_url: string;
		description?: string;
		width?: number;
		height?: number;
	};
}) {

	const router = useRouter();

	const [formData, setFormData] = useState({
		title: data.title ?? "",
		image_url: data.image_url ?? "",
		description: data.description ?? "",
		width: data.width ?? 0,
		height: data.height ?? 0,
	});

	const [formState, setFormState] = useState<FormState>({});
	const [pending, setPending] = useState(false);

	async function handleSubmit(e: FormEvent) {

		e.preventDefault();
		if (pending) return;
		setPending(true);

		const { error } = await updateGalleryItem(data.id, data.collectionId, formData);

		setFormState({
			error,
			success: !error,
			message: !error ? "Updated!" : ""
		});

		setPending(false);
		router.refresh();

	};

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {

		const { name, value, type } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
		}));

	};

	const isFormComplete = formData.title.trim().length > 0;

	const hasChanges =
		formData.title.trim() !== data.title ||
		(formData.description ?? "") !== (data.description ?? "") ||
		Number(formData.width) !== (data.width ?? 0) ||
		Number(formData.height) !== (data.height ?? 0);

	const canSave = isFormComplete && hasChanges && !pending;

	useEffect(() => {

		if (formState.success) {

			if (onSuccess) onSuccess();
			setFormData(initialForm);

		};

	}, [formState.success, onSuccess]);

	return (

		<form
			className="h-auto flex items-start space-x-4"
			onSubmit={handleSubmit}
		>

			<div
				className="grid gap-4"
			>

				<div className="grid w-full max-w-sm items-center gap-2">
					<Label htmlFor="title">Title</Label>
					<Input
						type="text"
						id="title"
						name="title"
						placeholder="Title"
						value={formData.title}
						onChange={handleInputChange}
					/>
				</div>

				<div className="grid w-full max-w-sm items-center gap-2">

					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleInputChange}
					/>

				</div>

				<div className="grid grid-cols-2 gap-4">

					<div className="grid w-full max-w-sm items-center gap-2">
						<Label htmlFor="width">Width (cm)</Label>
						<Input
							type="number"
							id="width"
							name="width"
							value={formData.width}
							onChange={handleInputChange}
							disabled
						/>
					</div>

					<div className="grid w-full max-w-sm items-center gap-2">
						<Label htmlFor="height">Height (cm)</Label>
						<Input
							type="number"
							id="height"
							name="height"
							value={formData.height}
							onChange={handleInputChange}
							disabled
						/>
					</div>

				</div>

				<div className="w-full space-y-4">

					<Button
						type="submit"
						disabled={!canSave}
						className="w-full"
					>

						{pending ? (
							<Loader2 className="w-5 h-5 text-green-600 animate-spin shrink-0" />
						) : (
							<span>
								Save changes
							</span>
						)}

					</Button>

					{formState?.error && (
						<p className="text-xs text-red-600 text-center">{formState.error}</p>
					)}

					{formState?.success && (
						<p className="text-xs text-green-600 text-center">{formState.message}</p>
					)}

				</div>

			</div>

			<div className="h-full flex items-center bg-neutral-200 rounded-md">
				<img
					className="w-40"
					src={data.image_url}
					alt=""
				/>
			</div>

		</form>

	);

};