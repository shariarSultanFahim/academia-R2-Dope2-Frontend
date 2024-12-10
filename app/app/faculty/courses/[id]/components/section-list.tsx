"use client";
import { CiEdit } from "react-icons/ci";

interface SectionListProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	course_sections: any[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onEdit?: (section: any) => void;
}

export default function SectionList({
	course_sections,
	onEdit,
}: SectionListProps) {
	return (
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
							<th className="border px-4 py-2 text-left">Action</th>
						</tr>
					</thead>
					<tbody>
						{course_sections.map((section, index) => (
							<tr
								key={section.id}
								className={
									index % 2 === 0 ? "bg-gray-700" : "bg-gray-800 border-white"
								}
							>
								<td className="border px-4 py-2">{section.section_title}</td>
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
								<td className="border px-4 py-2">
									<button
										className="bg-blue-500 text-white px-4 py-2 rounded"
										onClick={() => (onEdit ? onEdit(section) : null)}
									>
										<CiEdit size={20} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No course sections available.</p>
			)}
		</div>
	);
}
