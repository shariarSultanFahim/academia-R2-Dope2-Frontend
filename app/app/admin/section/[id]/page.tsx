"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSectionById } from "@/lib/actions/courses/section/section-get-by-id";
import moment from "moment";
import { useParams } from "next/navigation";

export default function Section() {
  const params = useParams();
  const { data } = useGetSectionById(params.id);

  const details = data?.data?.data;
  console.log("details", details);
  // console.log(params);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Section Title:</strong> {details?.section_title}
          </p>
          <p>
            <strong>Section Description:</strong> {details?.section_description}
          </p>
          <p>
            <strong>Total seat:</strong>
            {details?.section_total_seats}
          </p>
          <p>
            <strong>Total Enrolled Student:</strong>
            {details?._count?.section_total_enrolled_students}
          </p>
          <p>
            <strong>Total Faculty:</strong>{" "}
            {details?._count?.course_section_faculty_assignments}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Timestamps</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Created At:</strong>{" "}
            {moment(details?.created_at).format("LLL")}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {moment(details?.updated_at).format("LLL")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
