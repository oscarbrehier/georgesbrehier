import { useState } from "react";

export function useDragAndDrop(onImageProcess: (files: FileList) => void) {

	const [isDragging, setIsDragging] = useState(false);

	const handleDragEnter = (e: React.DragEvent) => {

		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);

	};

	const handleDragLeave = (e: React.DragEvent) => {

		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

	};

	const handleDragOver = (e: React.DragEvent) => {

		e.preventDefault();
		e.stopPropagation();

	};

	const handleDrop = (e: React.DragEvent) => {

		e.preventDefault();
		e.stopPropagation();

		const files = e.dataTransfer.files;

		if (files.length > 0) {
			onImageProcess(files);
		};

	};

	const resetDrag = () => setIsDragging(false);

	return {
		isDragging,
		resetDrag,
		handleDragEnter,
		handleDragLeave,
		handleDragOver,
		handleDrop
	}

};