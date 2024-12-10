// import { getCustomerById } from "@/lib/actions/customers/get-by-id";
// import { notFound } from "next/navigation";

import CoursesLayout from "./courses-layout";


export default async function CustomerDetailLayout({
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
			<CoursesLayout params={params}>{children}</CoursesLayout>
		</>
	);
}
