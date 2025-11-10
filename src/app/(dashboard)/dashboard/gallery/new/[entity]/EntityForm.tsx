"use client"

import { createCollection } from "@/app/actions/createCollection";
import { Check, Info } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormState } from "react-dom";

const initialState = { message: "", error: "" };

export function EntityForm({
	entity,
	sections = [],
}: {
	entity: string,
	sections: GallerySection[]
}) {

	const [formData, setFormData] = useState({
		sectionId: "",
		collectionTitle: "",
		isDefault: false
	});

	const [state, formAction] = useActionState<{ message?: string, error?: string } | undefined, FormData>(createCollection, initialState);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {

		const { name, value, type } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value.toLocaleLowerCase()
		}));

	};

	const isFormComplete =
		formData.sectionId.trim().length > 0 &&
		formData.collectionTitle.trim().length > 0;

	return (


		<form
			action={formAction}
			className="w-full max-w-2xl space-y-8"
		>

			<p className="capitalize text-neutral-800 font-medium text-4xl">new collection</p>

			<div>

				<label htmlFor="section" className="block text-sm font-medium text-neutral-700 mb-2">
					Section
				</label>

				<select
					id="section"
					name="sectionId"
					value={formData.sectionId}
					onChange={handleInputChange}
					className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all appearance-none cursor-pointer"
				>

					<option value="">Choose a section</option>
					{sections.map((section) => (
						<option
							key={section.id}
							className=""
							value={section.id}>{section.title}</option>
					))}

				</select>

			</div>

			<div>

				<label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
					Collection Title
				</label>

				<input
					id="title"
					type="text"
					name="collectionTitle"
					disabled={!formData.sectionId || formData.sectionId === ""}
					value={formData.collectionTitle}
					onChange={handleInputChange}
					className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
				/>

			</div>

			<div className="flex items-center gap-2">

				<input
					className="
						relative peer shrink-0
						appearance-none w-4 h-4 border-2 border-blue-500 rounded-sm bg-neutral-50
						checked:bg-blue-800 checked:border-0"
					id="default"
					type="checkbox"
					name="isDefault"
					checked={formData.isDefault}
					onChange={handleInputChange}
				/>

				<label htmlFor="default" className="block text-sm font-medium text-neutral-700">
					Default
				</label>

				<div
					title={"Set this collection as the default for this section. Any previously selected default will be replaced."}
				>
					<Info
						size={16}
						className="text-neutral-700"
					/>
				</div>

				<Check
					className="
						absolute 
						w-4 h-4
						hidden peer-checked:block
						pointer-events-none text-white
					"
				/>

			</div>

			{formData.collectionTitle && (
				<div>

					<p className="block text-sm font-medium text-neutral-700 mb-2">Collection Slug :</p>
					<p className="text-neutral-800">{formData.collectionTitle.toLocaleLowerCase().replace(/ /g, "-")}</p>

				</div>
			)}

			<div className="space-y-2">

				{state?.error && (
					<div className="p-4 rounded-lg bg-red-50 border border-red-200">
						<p className="text-sm text-red-600">{state?.error}</p>
					</div>
				)}

				{state?.message && (
					<div className="p-4 rounded-lg bg-green-50 border border-green-200">
						<p className="text-sm text-green-600">{state?.message}</p>
					</div>
				)}

				<button
					type="submit"
					disabled={!isFormComplete}
					className="w-full py-3 px-6 rounded-lg bg-neutral-900 text-white font-medium transition-all duration-200 hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					Create collection {formData.collectionTitle && `: ${formData.collectionTitle}`}
				</button>

			</div>

		</form>


	);

};