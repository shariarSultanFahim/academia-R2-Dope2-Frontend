import { useGetCourseById } from "@/lib/actions/courses/course-by-id";
import { useUpdateCourse } from "@/lib/actions/courses/update-course";
import handleResponse from "@/lib/response.utils";
import { useState } from "react";
import { toast } from "sonner";
import CreateCourseForm from "./course-form";
export function UpdateCourse({ courseId }: { courseId: number | string }) {
	const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
	const { data: course } = useGetCourseById(courseId);
	const { mutateAsync: update } = useUpdateCourse();
	// console.log("courseId", courseId);
	// console.log("course to update", course);

	// Need To Debug
	const handleUpdate = async (updatedData: unknown) => {
		console.log("updatedData", updatedData);
		const res = await handleResponse(
			() => update({ id: courseId, data: updatedData }),
			200
		);
		console.log("res", res);
		// const res = await update({ id: courseId, ...data });
		if (res.status) {
			toast("Course Updated!", {
				description: "The course has been updated successfully.",
			});
			setIsCreateCourseOpen(false);
		} else {
			toast.error("Error updating course");
		}
	};

	return (
		<CreateCourseForm
			initialData={course?.data.data}
			open={isCreateCourseOpen}
			setOpen={setIsCreateCourseOpen}
			onSubmit={handleUpdate}
		/>
	);
}
