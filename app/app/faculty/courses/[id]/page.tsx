"use client";
import { Button } from "@/components/ui/button";
import { useGetCourseById } from "@/lib/actions/courses/course-by-id";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
	const params = useParams<{ id: string }>();

	const { data } = useGetCourseById(params.id);
	const course = data?.data.data;
	const course_sections = course?.course_sections;

	return (
		<>
			<div className="flex justify-between px-6 py-4">
				<h2 className="text-lg font-semibold mb-4">{course?.course_title}</h2>
				<Button>Update</Button>
			</div>

			<div className="px-6 rounded-md">
				{course_sections?.length ? (
					<table className="table-auto w-full border border-gray-200">
						<thead>
							<tr className="bg-gray-800">
								<th className="border px-4 py-2 text-left">Section Title</th>
								<th className="border px-4 py-2 text-left">Total Seats</th>
								<th className="border px-4 py-2 text-left">Description</th>
								<th className="border px-4 py-2 text-left">Total Faculty</th>
								<th className="border px-4 py-2 text-left">Total Students</th>
							</tr>
						</thead>
						<tbody>
							{
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								course_sections.map((section: any, index: number) => (
									<tr
										key={section.id}
										className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}
									>
										<td className="border px-4 py-2">
											{section.section_title}
										</td>
										<td className="border px-4 py-2">
											{section.section_total_seats}
										</td>
										<td className="border px-4 py-2">
											{section.section_description || "N/A"}
										</td>
										<td className="border px-4 py-2">
											{section._count.course_section_faculty_assignments}
										</td>
										<td className="border px-4 py-2">
											{section._count.course_section_student_enrollments}
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
				) : (
					<p>No course sections available.</p>
				)}
			</div>
		</>
	);
}
