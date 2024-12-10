import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCourseById } from "@/lib/actions/courses/course-by-id";
import moment from "moment";

export default function CourseDetails({ course_id }: { course_id: number }) {
  const { data } = useGetCourseById(course_id);
  const details = data?.data?.data;
  console.log("details", details);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Course Title:</strong> {details?.course_title}
          </p>
          <p>
            <strong>Course Description:</strong> {details?.course_description}
          </p>
          <p>
            <strong>Course Code:</strong> {details?.course_code}
          </p>
          <p>
            <strong>Course Credits:</strong> {details?.course_credits}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Timestamps</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Start Date:</strong>
            {moment(details?.course_start_date).format("lll")}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {moment(details?.course_end_date).format("lll")}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {moment(details?.created_at).format("lll")}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {moment(details?.updated_at).format("lll")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
