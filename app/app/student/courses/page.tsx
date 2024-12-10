import { Separator } from "@/components/ui/separator";

import CourseList from "./components/course-list";
export default function CoursesPage() {
  return (
    <div className="space-y-4 block">
      <div className="p-6 pb-1 flex flex-row items-center justify-between">
        <div className="space-y-0.5 ">
          <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground text-sm">
            Here&apos;s a list of your Courses!
          </p>
        </div>
      </div>
      <Separator />

      <div className="px-9">
        <CourseList />
      </div>
    </div>
  );
}
