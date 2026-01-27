import { toast } from "sonner";
import { create } from "zustand";

export interface ArtworkMetadata {
	id: string;
	file: File;
	preview: string;
	title: string;
	description: string;
	width?: number;
	height?: number;
};

export interface UploadFormData {
	sectionId: string;
	collectionId: string;
	items: ArtworkMetadata[];
};

interface UploadFormState {
	formData: UploadFormData;
	setGlobalData: (data: Partial<Omit<UploadFormData, 'items'>>) => void;
	updateItem: (id: string, data: Partial<ArtworkMetadata>) => void;
	addItems: (newItems: ArtworkMetadata[]) => void;
	removeItem: (id: string) => void;
	resetForm: () => void;
};

const initialState: UploadFormData = {
	sectionId: "",
	collectionId: "",
	items: [],
};

export const useUploadFormStore = create<UploadFormState>((set) => ({
	formData: initialState,

	setGlobalData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),

	addItems: (newItems) =>
		set((state) => {

			const uniqueNewItems = newItems.filter(newItem =>
				!state.formData.items.some(existingItem =>
					existingItem.title === newItem.title &&
					existingItem.file.size === newItem.file.size
				)
			);

			if (uniqueNewItems.length === 0) {
				return state;
			};

			return {
				formData: {
					...state.formData,
					items: [...state.formData.items, ...uniqueNewItems]
				}
			};

		}),

	updateItem: (id, data) =>
		set((state) => ({
			formData: {
				...state.formData,
				items: state.formData.items.map((item) =>
					item.id === id ? { ...item, ...data } : item
				)
			}
		})),

	removeItem: (id) =>
		set((state) => {

			const item = state.formData.items.find(i => i.id === id);

			if (item?.preview) {
				URL.revokeObjectURL(item.preview);
			};

			return {
				formData: {
					...state.formData,
					items: state.formData.items.filter((item) => item.id !== id)
				}
			};

		}),

	resetForm: () => set((state) => {

		state.formData.items.forEach(i => {
			URL.revokeObjectURL(i.preview);
		});

		return { formData: initialState };

	}),
}));