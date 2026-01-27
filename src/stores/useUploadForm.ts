import { ImageFile } from "@/app/(dashboard)/dashboard/upload/UploadV2";
import { create } from "zustand";

export interface ArtworkMetadata {
	id: string;
	file: File;
	preview: string;
	title: string;
	description: string;
	width?: string;
	height?: string;
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
		set((state) => ({
			formData: { ...state.formData, items: [...state.formData.items, ...newItems] }
		})),

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
		set((state) => ({
			formData: {
				...state.formData,
				items: state.formData.items.filter((item) => item.id !== id)
			}
		})),

	resetForm: () => set({ formData: initialState }),
}));