import { Button, ButtonText } from "@/app/(dashboard)/components/Button";
import { NavigatorUI } from "../NavigatorUI";
import { updateCollection, updateCollectionPositions } from "@/app/(dashboard)/actions/collections";
import { getCollectionsBySection } from "@/utils/supabase/collections";
import { getSectionId } from "@/utils/supabase/sections";
import { notFound } from "next/navigation";

export default async function Page({
	params
}: {
	params: Promise<{ section: string }>
}) {

	const { section: sectionSlug } = await params;

	const sectionId = await getSectionId(sectionSlug);

	if (!sectionId) {

		return (

			<div className="h-32 w-full flex flex-col items-center justify-center">

				<h1 className="text-xl font-medium">Section Not Found</h1>
				<p className="text-neutral-500">The section "{sectionSlug}" may have been moved or deleted.</p>
				
				<a className="mt-4" href="/dashboard/sections">
					<Button		
					>
						<ButtonText>
							Return to Sections
						</ButtonText>
					</Button>
				</a>

			</div>

		);

	};

	const collections = await getCollectionsBySection(sectionId)

	return (


		<div className="h-full w-full flex flex-col">

			<NavigatorUI
				title={sectionSlug}
				items={collections}
				type="collection"
				basePath={sectionSlug}
				onSave={updateCollectionPositions}
				onUpdateField={updateCollection}
			/>

		</div>

	);

};