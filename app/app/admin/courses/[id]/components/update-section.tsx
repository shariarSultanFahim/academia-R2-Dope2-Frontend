"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import handleResponse from "@/lib/response.utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useGetSections } from "@/lib/actions/courses/section/sections.get";
import { useUpdateSection } from "@/lib/actions/courses/section/update-section";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetSectionById } from "@/lib/actions/courses/section/section-get-by-id";

const UpdateSectionSchema = z.object({
	course_id:z.number(),
	section_title: z.string().min(1, { message: "Section title is required." }),
	section_description: z.string().optional(),
	section_total_seats: z.number().optional().default(0),
});

type UsersFormValues = z.infer<typeof UpdateSectionSchema>;

export function UpdateSection({
	id, 
  	children
}: Readonly<{
	children?: React.ReactNode;
	id: number | string;
}>) {
	const [open, setOpen] = useState(false);

	const { data: section, isLoading } = useGetSectionById(id);

	const form = useForm<UsersFormValues>({
		resolver: zodResolver(UpdateSectionSchema),
		defaultValues: {
			course_id: parseInt(section?.data?.data.course_id || ""),
			section_title: section?.data?.data.section_title || "",
			section_description: section?.data?.data.section_description || "",
			section_total_seats: section?.data?.data.section_total_seats || null
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (!section) return;

		form.reset({
			course_id: section?.data?.data.course_id || "",
			section_title: section?.data?.data.section_title || "",
			section_description: section?.data?.data.section_description || "",
			section_total_seats: section?.data?.data.section_total_seats || null
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [section]);

	const { mutateAsync: update, isPending } = useUpdateSection();


	async function onSubmit(data: UsersFormValues) {
		form.clearErrors();
		
		const res = await handleResponse(() => update({ id: id, data }), [200]);
		if (res.status) {
			toast("Updated!", {
				description: `Section has been updated successfully.`,
			});
			setOpen(false);
		} else {
			if (typeof res.data === "object") {
				Object.entries(res.data).forEach(([key, value]) => {
					form.setError(key as keyof UsersFormValues, {
						type: "validate",
						message: value as string,
					});
				});
				toast("Error!", {
					description: `There was an error updating Section. Please try again.`,
					action: {
						label: "Retry",
						onClick: () => onSubmit(data),
					},
				});
			} else {
				toast("Error!", {
					description: res.message,
					action: {
						label: "Retry",
						onClick: () => onSubmit(data),
					},
				});
			}
		}
	}

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={(o) => setOpen(o)}
			>
				<SheetTrigger asChild>
					{children || <Button>Update</Button>}
				</SheetTrigger>
				<SheetContent className="max-h-screen overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Update Section</SheetTitle>
						<SheetDescription>
							Complete the form below to update the section information.
						</SheetDescription>
					</SheetHeader>
					{isLoading ? (
						<div className="space-y-4 mt-5">
							<Skeleton className="h-16" />
							<Skeleton className="h-16" />
							<Skeleton className="h-16" />
							<Skeleton className="h-10 w-24 float-right" />
						</div>
					) : (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-3 mt-6 px-1"
							>
							<FormField
							control={form.control}
							name="section_title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Section Title*</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter section title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="section_description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Section Description</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter section description"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="section_total_seats"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Section Total Seats*</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter section total seats"
											{...field}
											onChange={(e) => {
												// Parse the input as a number
												const parsedValue = Number(e.target.value);
												// Update the field value as a number
												field.onChange(
													isNaN(parsedValue) ? undefined : parsedValue
												);
											}}
											value={field.value ?? ""} // Ensure value is string for the input
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
									)}
								/>

								<SheetFooter>
									<SheetClose asChild>
										<Button variant={"ghost"}>Cancel</Button>
									</SheetClose>
									<Button
										type="submit"
										disabled={isPending}
									>
										Save
									</Button>
								</SheetFooter>
							</form>
						</Form>
					)}
				</SheetContent>
			</Sheet>
		</>
	);
}
