import { Eye, EyeOff } from "lucide-react";
import { Button, ButtonText } from "../../components/Button";
import { useState } from "react";
import { setCollectionVisibility } from "../../actions/setCollectionVisibility";
import { toast } from "sonner";

export function CollectionVisibilityBtn({
	collection
}: {
	collection: GalleryCollection;
}) {

	const [isVisible, setIsVisible] = useState(collection.visible);
	const [isPending, setIsPending] = useState(false);

	async function toggleVisibility() {

		if (isPending) return ;
		setIsPending(true);

		try {

			await setCollectionVisibility(collection.id, !isVisible);
			setIsVisible(!isVisible);

		} catch (err) {

			const message = err instanceof Error ? err.message : "Unknown error";
			toast("Failed to change collection visibility", { description: message });

		} finally {
			setIsPending(false);
		};

	};

	return (

		<Button
			size="sm"
			variant="base"
			Icon={isVisible ? EyeOff : Eye}
			onClick={toggleVisibility}
			disabled={isPending}
		>
			<ButtonText>
				{isVisible ? "Hide from site" : "Show on site"}
			</ButtonText>
		</Button>

	);

};