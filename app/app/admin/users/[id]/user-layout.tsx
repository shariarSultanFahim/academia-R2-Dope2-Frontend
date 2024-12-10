"use client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGetUserById } from "@/lib/actions/users/user-by-id";
import { UpdateUser } from "../(list)/update-user";
import { Loading } from "@/app/app/token-validation-checker";

export default function UserLayout({
	children,
	params,
}: Readonly<{ children: React.ReactNode; params: { id: number } }>) {
	const { data } = useGetUserById(params.id);
	return !data ? (
		<Loading />
	) : (
		<>
			<div className="min-h-screen flex flex-col">
				<div className="flex flex-row items-start md:items-center justify-between py-5 px-8">
					<div className="space-y-1">
						<div className="flex gap-2">
							<h1 className="text-sm font-semibold text-muted-foreground">
								User Details #{params.id}
							</h1>
							<Badge
								variant={
									data?.data?.data?.is_active ? "success" : "destructive"
								}
								className="text-[10px] font-bold"
							>
								{data?.data?.data?.is_active ? "Active" : "Inactive"}
							</Badge>
						</div>
						<div>
							<p className="text-sm text-muted-foreground font-medium">
								Last Updated: {format(data?.data?.data?.updated_at, "PPP")}
							</p>
							<p className="text-sm text-muted-foreground font-medium">
								Created: {format(data?.data?.data?.created_at, "PPP")}
							</p>
						</div>
					</div>

					<div className="md:flex flex-row items-start gap-3">
						<UpdateUser id={params.id}>
							<Button
								variant={"outline"}
								disabled={data?.data?.status === "sold"}
							>
								Update
							</Button>
						</UpdateUser>
					</div>
				</div>
				<Separator />
				<div className="flex-1 p-8">{children}</div>
			</div>
		</>
	);
}
