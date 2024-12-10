"use client";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Loading } from "@/app/app/token-validation-checker";
import { useGetCourseById } from "@/lib/actions/courses/course-by-id";

export default function CoursesLayout({
	children,
	params,
}: Readonly<{ children: React.ReactNode; params: { id: number } }>) {
	const { data } = useGetCourseById(params.id);
	return !data ? (
		<Loading />
	) : (
		<>
			<div className="min-h-screen flex flex-col">
				<div className="flex flex-row items-start md:items-center justify-between py-5 px-8">
					<div className="space-y-1">
						<div className="flex gap-2">
							<h1 className="text-sm font-semibold text-muted-foreground">
								Course Details #{params.id}
							</h1>
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
				</div>
				<Separator />
				<div className="flex-1 p-8">{children}</div>
			</div>
		</>
	);
}
