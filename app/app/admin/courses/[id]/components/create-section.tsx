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
import { useCreateSection } from "@/lib/actions/courses/section/create-section";
import handleResponse from "@/lib/response.utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateSectionSchema = z.object({
  course_id: z.number(),
  section_title: z.string().min(1, { message: "Section title is required." }),
  section_description: z.string().optional(),
  section_total_seats: z.number().optional().default(0),
});

export type CourseFormValues = z.infer<typeof CreateSectionSchema>;

interface CourseSectionParams {
  course_id?: number;
}

export default function CreateSection({ course_id }: CourseSectionParams) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: create } = useCreateSection();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(CreateSectionSchema),
    defaultValues: {
      course_id,
      section_title: "",
      section_description: "",
      section_total_seats: 0,
    },
    mode: "onChange",
  });

  async function handleSubmit(data: CourseFormValues) {
    form.clearErrors();
    console.log(data);
    const res = await handleResponse(() => create(data), [201]);
    if (res.status) {
      toast("Added!", {
        description: `Section has been created successfully.`,
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
          description: `There was an error creating section. Please try again.`,
          action: {
            label: "Retry",
            onClick: () => handleSubmit(data),
          },
        });
      } else {
        toast("Error!", {
          description: res.message,
          action: {
            label: "Retry",
            onClick: () => handleSubmit(data),
          },
        });
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
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
                    <Input placeholder="Enter section title" {...field} />
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
                    <Input placeholder="Enter section description" {...field} />
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
