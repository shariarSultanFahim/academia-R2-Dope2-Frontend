"use client";

import { Button } from "@/components/ui/button";
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
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateSectionSchema = z.object({
	section_title: z.string().min(1, { message: "Section title is required." }),
	section_description: z.string().optional(),
	section_total_seats: z.number().min(1, {
		message: "Section total seats must be 1 or greater.",
	}),
});

type SectionFormValues = z.infer<typeof CreateSectionSchema>;

interface CreateSectionProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	initialData?: SectionFormValues;
	onSubmit?: (data: SectionFormValues) => void;
}

export default function CreateSection({
	open,
	setOpen,
	initialData = {
		section_title: "",
		section_description: "",
		section_total_seats: 0,
	},
}: CreateSectionProps) {
	const form = useForm<SectionFormValues>({
		resolver: zodResolver(CreateSectionSchema),
		defaultValues: initialData,
		mode: "onChange",
	});

	const handleSubmit = async (data: SectionFormValues) => {
		form.clearErrors(); // Clear previous errors
		console.log("Form Data:", data); // Debugging purposes
		setOpen(false); // Close the sheet
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(o) => setOpen(o)}
		>
			<Button onClick={() => setOpen(true)}>Add New Section</Button>
			<SheetContent className="max-h-screen overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Create Section</SheetTitle>
					<SheetDescription>
						Fill out the form below to create a new section.
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4 mt-6 px-1"
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
								<Button variant="ghost">Cancel</Button>
							</SheetClose>
							<Button type="submit">Save</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
