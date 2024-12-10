import SectionLayout from "./section-layout";

export default async function SectionDetailsLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: {
		id: number;
	};
}>) {

	return (
		<>
			<SectionLayout params={params}>{children}</SectionLayout>
		</>
	);
}
