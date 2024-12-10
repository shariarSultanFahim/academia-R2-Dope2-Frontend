// "use client";
// import { Button } from "@/components/ui/button";
// import { useGetCourseById } from "@/lib/actions/courses/course-by-id";
// import { useParams } from "next/navigation";
// import SectionList from "./components/section-list";

// export default function CourseDetailPage() {
//   const params = useParams();

//   const { data } = useGetCourseById(params.id);
//   const course = data?.data.data;
//   const course_sections = course?.course_sections;

//   return (
//     <>
//       <div className="flex justify-between px-6 py-4">
//         <h2 className="text-lg font-semibold mb-4">{course?.course_title}</h2>
//         <Button>Add New</Button>
//       </div>

//       {course_sections?.length ? (
//         <SectionList course_sections={course_sections} />
//       ) : (
//         <div>
//           <p className="text-sm text-muted-foreground font-medium">
//             No Sections yet
//           </p>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useGetCourseById } from "@/lib/actions/courses/course-by-id";
import { useParams } from "next/navigation";

import SectionList from "./components/section-list";
import CreateSection from "./components/create-section";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function CourseDetailPage() {
	const params = useParams<{ id: string }>();
	const { data } = useGetCourseById(params.id);
	const course = data?.data.data;
	return (
		<>
			<div className="flex justify-between px-6 py-4">
				<h2 className="text-lg font-semibold mb-4">{course?.course_title}</h2>
				<CreateSection course_id={parseInt(params.id)}/>
			</div>

			<Separator/>
			<SectionList course_id={parseInt(params.id)}/>
			
		</>
	);
}
