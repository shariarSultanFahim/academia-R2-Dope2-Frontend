"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useCreateCourse } from "@/lib/actions/courses/create-course";
import handleResponse from "@/lib/response.utils";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateCourseSchema = z.object({
	course_title: z.string().min(1, {
		message: "Course title is required.",
	}),
	course_description: z.string().optional(),
	course_cover_url: z.string().url({
		message: "Must be a valid URL.",
	}),
	course_start_date: z.string().min(1, {
		message: "Start date is required.",
	}),
	course_end_date: z.string().min(1, {
		message: "End date is required.",
	}),
	course_code: z.string().min(1, {
		message: "Course code is required.",
	}),
	course_credits: z.number().min(0, {
		message: "Credits must be 0 or greater.",
	}),
	course_status: z.enum(["PLANNED", "ONGOING", "COMPLETED"]),
});

type CourseFormValues = z.infer<typeof CreateCourseSchema>;

export default function CreateCourse() {
	const [open, setOpen] = useState(false);
	const { mutateAsync: create, isPending } = useCreateCourse();

	const form = useForm<CourseFormValues>({
		resolver: zodResolver(CreateCourseSchema),
		defaultValues: {
			course_title: "",
			course_description: "",
			course_cover_url: "",
			course_start_date: "",
			course_end_date: "",
			course_code: "",
			course_credits: 0,
			course_status: "PLANNED",
		},
		mode: "onChange",
	});

	async function onSubmit(data: CourseFormValues) {
		form.clearErrors();

		console.log(data);
		const res = await handleResponse(() => create(data), [201]);
		if (res.status) {
			toast("Added!", {
				description: `User has been created successfully.`,
			});
			form.reset();
			setOpen(false);
		} else {
			if (typeof res.data === "object") {
				Object.entries(res.data).forEach(([key, value]) => {
					form.setError(key as keyof CourseFormValues, {
						type: "validate",
						message: value as string,
					});
				});
				toast("Error!", {
					description: `There was an error creating user. Please try again.`,
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
		<Sheet
			open={open}
			onOpenChange={(o) => setOpen(o)}
		>
			<Button onClick={() => setOpen(true)}>Add New Course</Button>
			<SheetContent className="max-h-screen overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Create Course</SheetTitle>
					<SheetDescription>
						Complete the form below to create a new course.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-3 mt-6 px-1"
					>
						<FormField
							control={form.control}
							name="course_title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Title*</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter course title"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="course_description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Description</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter course description"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="course_cover_url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cover URL*</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com/cover.jpg"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="course_start_date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Start Date*</FormLabel>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													captionLayout="dropdown-buttons"
													selected={
														field.value ? new Date(field.value) : undefined
													}
													onSelect={(date: Date | undefined) => {
														if (date) {
															field.onChange(format(date, "yyyy-MM-dd"));
														}
													}}
													fromYear={moment().year() - 100}
													toYear={moment().year()}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="course_end_date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>End Date*</FormLabel>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													captionLayout="dropdown-buttons"
													selected={
														field.value ? new Date(field.value) : undefined
													}
													onSelect={(date: Date | undefined) => {
														if (date) {
															field.onChange(format(date, "yyyy-MM-dd"));
														}
													}}
													fromYear={moment().year() - 100}
													toYear={moment().year()}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="course_code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Code*</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter course code"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="course_credits"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Credits*</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="0"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="course_status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Status*</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="PLANNED">Planned</SelectItem>
											<SelectItem value="ONGOING">Ongoing</SelectItem>
											<SelectItem value="COMPLETED">Completed</SelectItem>
										</SelectContent>
									</Select>
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
			</SheetContent>
		</Sheet>
	);
}
