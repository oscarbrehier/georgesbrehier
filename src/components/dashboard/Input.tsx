type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	id: string;
	sublabel?: string;
};

export function Input({ label, id, sublabel, ...props }: InputProps) {
	
	return (

		<div>

			<label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-2">
				{label}
			</label>

			<input
				id={id}
				{...props}
				className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
			/>

			{
				sublabel && (
					<p className="text-neutral-600 text-xs w mt-1.5">{sublabel}</p>
				)
			}

		</div>

	);

};