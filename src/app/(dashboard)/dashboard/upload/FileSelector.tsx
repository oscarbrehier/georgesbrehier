import { Cloud } from "lucide-react";
import { ChangeEvent } from "react";

type Props = {
	drag: any;
	onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function FileSelector({
	drag,
	onInputChange
}: Props) {

	return (

		<div
			onDragEnter={drag.handleDragEnter}
			onDragLeave={drag.handleDragLeave}
			onDragOver={drag.handleDragOver}
			onDrop={drag.handleDrop}
			className={`w-full relative rounded-2xl border-2 border-dashed transition-all duration-300 ease-out ${drag.isDragging
				? "border-neutral-400 bg-dashboard"
				: "border-neutral-200"
				}`}
		>

			<input
				id="image_input"
				type="file"
				accept="image/jpeg,image/png,image/webp"
				multiple
				onChange={onInputChange}
				className="hidden"
			/>

			<div className="px-12 py-8 text-center">

				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dashboard mb-4">
					<Cloud className="w-8 h-8 text-neutral-600" />
				</div>

				<h3 className="text-lg font-medium text-neutral-900 mb-2">
					Drag your images here
				</h3>

				<p className="text-sm text-neutral-600 mb-4">
					or click to browse (multiple files supported)
				</p>

				<label htmlFor="image_input" className="inline-block">
					<span className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-neutral-900 text-white font-medium text-sm cursor-pointer hover:bg-neutral-800 transition-colors">
						Select images
					</span>
				</label>

			</div>

		</div>

	);

};