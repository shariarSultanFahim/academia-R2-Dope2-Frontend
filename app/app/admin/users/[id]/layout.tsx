// import { getCustomerById } from "@/lib/actions/customers/get-by-id";
// import { notFound } from "next/navigation";
import UserLayout from "./user-layout";

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
			<UserLayout params={params}>{children}</UserLayout>
		</>
	);
}
