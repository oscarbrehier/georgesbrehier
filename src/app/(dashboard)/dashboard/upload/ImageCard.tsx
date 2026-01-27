"use client"

import { ChangeEvent } from "react"
import { X, ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArtworkMetadata } from "@/stores/useUploadForm"
import { UploadProgress } from "./Upload"
import { cn } from "@/utils/utils"

export interface ImageData {
	id: string;
	preview: string;
	title: string;
};

interface ImageCardProps {
	data: ImageData;
	onUpdate: (id: string, data: Partial<ArtworkMetadata>) => void;
	onRemove: (id: string) => void;
	progress?: UploadProgress;
	disabled: boolean;
};

export function ImageCard({
	data,
	onUpdate,
	onRemove,
	progress,
	disabled,
}: ImageCardProps) {

	const isError = progress?.status === "error";
	const isSuccess = progress?.status === "success";

	const borderStyle = isError
		? "border-red-500/50"
		: isSuccess
			? "border-emerald-500/50"
			: "border-border"

	function onInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {

		const { name, value } = e.target;

		onUpdate(data.id, {
			[name]: value
		});

	}

	return (

		<div className={cn("group relative overflow-hidden rounded-lg border border-border bg-card", borderStyle)}>

			<Button
				variant="ghost"
				size="icon"
				onClick={() => onRemove(data.id)}
				className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
				aria-label="Remove image"
			>
				<X className="h-4 w-4" />
			</Button>

			<div className="aspect-video w-full overflow-hidden bg-secondary">

				{data.preview ? (
					<img
						src={data.preview || "/placeholder.svg"}
						alt={data.title || "Uploaded image"}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<ImageIcon className="h-12 w-12 text-muted-foreground" />
					</div>
				)}

			</div>

			<div className="space-y-4 p-4">

				<div className="space-y-2">

					<Label htmlFor={`title-${data.id}`} className="text-xs text-muted-foreground">
						Title *
					</Label>

					<Input
						id={`title-${data.id}`}
						name="title"
						value={data.title}
						onChange={onInputChange}
						placeholder="Enter title"
						className="h-9 bg-input border-border"
						disabled={disabled}
					/>

				</div>

				<div className="space-y-2">

					<Label htmlFor={`desc-${data.id}`} className="text-xs text-muted-foreground">
						Description
					</Label>

					<Textarea
						id={`desc-${data.id}`}
						name="description"
						placeholder="Enter description"
						onChange={onInputChange}
						rows={2}
						className="resize-none bg-input border-border"
						disabled={disabled}
					/>

				</div>

				<div className="grid grid-cols-2 gap-3">

					<div className="space-y-2">

						<Label htmlFor={`width-${data.id}`} className="text-xs text-muted-foreground">
							Width (cm)
						</Label>

						<Input
							id={`width-${data.id}`}
							name="width"
							type="number"
							onChange={onInputChange}
							className="h-9 bg-input border-border"
							disabled={disabled}
						/>

					</div>
					<div className="space-y-2">

						<Label htmlFor={`height-${data.id}`} className="text-xs text-muted-foreground">
							Height (cm)
						</Label>

						<Input
							id={`height-${data.id}`}
							name="height"
							type="number"
							onChange={onInputChange}
							className="h-9 bg-input border-border"
							disabled={disabled}
						/>

					</div>

				</div>

				<p className="text-xs text-muted-foreground">
					Fields marked with * are required
				</p>

				{isError && (
					<div className="flex items-center gap-4 rounded-md bg-red-500/10 px-4 py-2">
						<AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
						<div className="space-y-0.5">
							<p className="text-xs font-medium text-red-500">Upload failed</p>
							<p className="text-xs text-red-400">{progress.error}</p>
						</div>
					</div>
				)}

				{isSuccess && (
					<div className="flex items-center gap-4 rounded-md bg-emerald-500/10 px-4 py-2">
						<CheckCircle2 className="h-4 w-4 text-emerald-500" />
						<p className="text-xs text-emerald-500">Upload complete</p>
					</div>
				)}

			</div>

		</div>

	);

};
