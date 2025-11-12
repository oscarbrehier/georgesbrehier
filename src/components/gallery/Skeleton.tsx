function SkeletonItem() {

	return (

		<div
			className="panel h-screen 2xl:w-[30vw] xl:w-[40vw] w-[50vw] relative flex items-center justify-center shrink-0"
		>
			<div className="bg-neutral-200 animate-pulse relative w-3/4 h-[75%]">
				
			</div>
		</div>

	);

};

export function GallerySkeleton() {

	return (

		<div className={`ml-36 h-screen w-full lg:flex hidden`}>
			
			<SkeletonItem />
			<SkeletonItem />
			<SkeletonItem />

		</div>

	);

};