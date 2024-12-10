"use client";

import { useGetCourseById } from "@/lib/actions/courses/course-by-id";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useParams } from "next/navigation";
import CourseDetails from "./components/course-details";
import CreateSection from "./components/create-section";
import SectionList from "./components/section-list";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const { data } = useGetCourseById(params.id);
  const course = data?.data.data;
  return (
    <>
      <div className="flex justify-between px-6 py-4">
        <h2 className="text-lg font-semibold mb-4">{course?.course_title}</h2>
        <CreateSection course_id={parseInt(params.id)} />
      </div>
      <Separator />
      <div className="w-full max-w-[85vw] lg:max-w-[70vw] mx-auto relative">
        <CourseDetails course_id={parseInt(params.id)} />
      </div>
      <SectionList course_id={parseInt(params.id)} />
    </>
  );
}
