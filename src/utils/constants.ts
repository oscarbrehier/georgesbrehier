export const UI_LABELS = {
	section: {
		singular: "volume",
		plural: "volumes",
		capitalized: "Volume",
		capPlural: "Volumes"
	},
	collection: {
		singular: "chapter",
		plural: "chapters",
		capitalized: "Chapter",
		capPlural: "Chapters"
	},
} as const;

export type ItemType = keyof typeof UI_LABELS;