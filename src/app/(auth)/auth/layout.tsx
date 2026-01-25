export default function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {

	return (

		<div
			className="h-auto w-full bg-dashboard"
		>
			{children}
		</div>

	);

};