import { Eye, EyeOff } from "lucide-react";
import { Button, ButtonText } from "../../components/Button";
import { useState } from "react";
import { toast } from "sonner";
import { setCollectionVisibility } from "../../actions/collections";

export function CollectionVisibilityBtn({
	collection
}: {
	collection: { id: string; section_id: string; is_visible: boolean };
}) {

	const [isVisible, setIsVisible] = useState(collection.is_visible);
	const [isPending, setIsPending] = useState(false);

	async function toggleVisibility() {

		if (isPending) return ;
		setIsPending(true);

		try {

			await setCollectionVisibility(collection.id, collection.section_id, !isVisible);
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