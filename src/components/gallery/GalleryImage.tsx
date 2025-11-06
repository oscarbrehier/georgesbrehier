export function GalleryImage({
	src,
	onNavigate,
	onClick,
	isTransitioning,
	focused
}: {
	src: { url: string, title: string, currentIdx?: number, totalImages?: number }
	onNavigate?: () => void,
	onClick?: () => void,
	isTransitioning: boolean,
	focused?: boolean
}) {

	if (focused) {

		return (

			<div
				onClick={onClick}
				className={`transition-all duration-500 ${isTransitioning ? 'scale-95' : 'scale-100'}`}
			>

				<div className="relative h-[70vh] w-auto aspect-[4/5] overflow-hidden rounded-md">
					<img
						src={src.url}
						alt={src.title}
						className="w-full h-full object-cover"
					/>
					{/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
						<h2 className="text-2xl font-bold text-white">{src.title}</h2>
						<p className="text-sm text-gray-300 mt-1">
							{src.currentIdx + 1} / {src.totalImages}
						</p>
					</div> */}
				</div>
				
			</div>

		);

	};

	return (

		<div
			onClick={onNavigate}
			className={`cursor-pointer transition-all duration-500 flex-shrink-0 ${isTransitioning ? 'opacity-50' : 'opacity-60 hover:opacity-80'
				}`}
		>
			<div className="relative w-64 h-80 overflow-hidden rounded-md">
				<img
					src={src.url}
					alt={src.title}
					className="w-full h-full object-cover"
					loading="eager"
				/>
			</div>
		</div>

	);

};