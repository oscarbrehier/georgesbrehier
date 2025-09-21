export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (

		<div className="h-auto w-full bg-white">
			{children}
		</div>

	);

};