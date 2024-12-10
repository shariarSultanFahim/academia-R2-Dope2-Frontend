"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateUser } from "@/lib/actions/users/create-users";
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

const CreateUsersSchema = z.object({
	first_name: z.string().min(1, {
		message: "First name must be at least 1 character.",
	}),
	last_name: z.string().min(1, {
		message: "Last name must be at least 1 character.",
	}),
	bio: z.string().optional(),
	dob: z.any().optional(),
	phone: z
		.string()
		.min(11, {
			message: "Phone number must be at least 11 characters.",
		})
		.max(11, { message: "Phone number cannot exceed 11 characters." }),
	secondary_phone: z.string().optional(),
	secondary_email: z.string().optional(),
	address: z.string().min(1, {
		message: "Address must be at least 1 character.",
	}),
	secondary_address: z.string().optional(),
	email: z.string().email({
		message: "Email must be a valid email address.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
	user_role: z.enum(["STUDENT", "FACULTY", "ADMIN"]),
	is_active: z.boolean(),
});

export type UsersFormValues = z.infer<typeof CreateUsersSchema>;

export function CreateUser() {
	const [open, setOpen] = useState(false);
	const { mutateAsync: create, isPending } = useCreateUser();

	const form = useForm<UsersFormValues>({
		resolver: zodResolver(CreateUsersSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			bio: "",
			dob: null,
			phone: "",
			secondary_phone: "",
			secondary_email: "",
			address: "",
			secondary_address: "",
			email: "",
			password: "",
			user_role: "STUDENT",
			is_active: true,
		},
		mode: "onChange",
	});

	async function onSubmit(data: UsersFormValues) {
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
					form.setError(key as keyof UsersFormValues, {
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
		<>
			<Sheet
				open={open}
				onOpenChange={(o) => setOpen(o)}
			>
				<Button onClick={() => setOpen(true)}>Add New</Button>
				<SheetContent className="max-h-screen overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Create User</SheetTitle>
						<SheetDescription>
							Complete the form below to create a new user for your institution.
						</SheetDescription>
					</SheetHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-3 mt-6 px-1"
						>
							<div className="flex flex-row items-start gap-3">
								<FormField
									control={form.control}
									name="first_name"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>First Name*</FormLabel>
											<FormControl>
												<Input
													placeholder="John"
													{...field}
												/>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="last_name"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel>Last Name*</FormLabel>
											<FormControl>
												<Input
													placeholder="Doe"
													{...field}
												/>
											</FormControl>
											<FormDescription></FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bio</FormLabel>
										<FormControl>
											<Textarea
												rows={5}
												placeholder="Enter bio"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your bio. It is optional.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dob"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date of Birth</FormLabel>
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
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone*</FormLabel>
										<FormControl>
											<Input
												placeholder="017XXXXXXXX"
												{...field}
											/>
										</FormControl>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="secondary_phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Secondary Phone</FormLabel>
										<FormControl>
											<Input
												placeholder="017XXXXXXXX"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your secondary phone. It is optional.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email*</FormLabel>
										<FormControl>
											<Input
												placeholder="example@domain.co"
												{...field}
											/>
										</FormControl>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="secondary_email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Secondary Email</FormLabel>
										<FormControl>
											<Input
												placeholder="example@domain.co"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your secondary email. It is optional.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password*</FormLabel>
										<FormControl>
											<Input
												placeholder="Password"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Password must be at least 6 characters.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address Line 1*</FormLabel>
										<FormControl>
											<Textarea
												rows={5}
												placeholder="1234 Main St, City, Country"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your primary address. It must be a valid address.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="secondary_address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Secondary Address</FormLabel>
										<FormControl>
											<Textarea
												rows={5}
												placeholder="1234 Main St, City, Country"
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your secondary address. It is optional. If you
											enter any address it must be a valid address.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="user_role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>User Role*</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a user role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="STUDENT">Student</SelectItem>
												<SelectItem value="FACULTY">Faculty</SelectItem>
												<SelectItem value="ADMIN">Admin</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="is_active"
								render={({ field }) => (
									<FormItem className="pt-4">
										<div className="flex flex-row items-center gap-2">
											<FormControl>
												<Switch
													id="is_active"
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<Label htmlFor="is_active">Active Status</Label>
										</div>
										<FormDescription>
											Active status will determine if the employee is active or
											not.
										</FormDescription>
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
		</>
	);
}
