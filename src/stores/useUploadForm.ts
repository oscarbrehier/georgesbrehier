import { create } from "zustand";

interface UploadFormData {
	title: string
	description: string
	sectionId: string
	collectionId: string
	images: File[]
	imagePreviews: string[]
};

interface UploadFormState {
	formData: UploadFormData;
	setFormData: (data: Partial<UploadFormData>) => void;
	resetForm: () => void;
};

const initialState = {
	title: "",
	description: "",
	sectionId: "",
	collectionId: "",
	images: [],
	imagePreviews: [],
};

export const useUploadFormStore = create<UploadFormState>((set) => ({
	formData: initialState,
	setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
	resetForm: () => set({ formData: initialState }),
}));