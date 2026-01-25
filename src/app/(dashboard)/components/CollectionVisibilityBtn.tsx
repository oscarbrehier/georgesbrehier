import { Eye, EyeOff } from "lucide-react";
import { Button, ButtonText } from "./Button";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateCollection } from "../actions/collections";
import { useRouter } from "next/navigation";

export function CollectionVisibilityBtn({
	collection
}: {
	collection: { id: string; is_visible: boolean };
}) {

	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const [isVisible, setIsVisible] = useState(collection.is_visible);

	async function toggleVisibility() {

		const newVisibility = !isVisible;

		setIsVisible(newVisibility);

		const { error } = await updateCollection(collection.id, { is_visible: newVisibility });

		if (error) {

			setIsVisible(!newVisibility);
			toast.error("Update failed", { description: error });

			return;

		};

		startTransition(() => {
			router.refresh();
		});

		toast.success(newVisibility ? "Chapter is now public" : "Chapter is now hidden");

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