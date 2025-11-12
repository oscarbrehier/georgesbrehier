type InputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
	label: string;
	id: string;
	options: { title: string; value?: string; id?: string }[];
	sublabel?: string;
};

export function Select({
	label,
	id,
	sublabel,
	options,
	...props
}: InputProps) {

	return (

		<div>

			<label htmlFor="section" className="block text-sm font-medium text-neutral-700 mb-2">
				{label}
			</label>

			<select
				id={id}
				{...props}
				className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all appearance-none cursor-pointer"
			>

				{/* <option value="">{optionTitle}</option> */}
				{options.map((option, idx) => (
					<option
						key={idx}
						{...(option.value && { value: option.value })}
					>
						{option.title}
					</option>
				))}

			</select>

			{
				sublabel && (
					<p className="text-neutral-600 text-xs w mt-1.5">{sublabel}</p>
				)
			}

		</div>

	);

};