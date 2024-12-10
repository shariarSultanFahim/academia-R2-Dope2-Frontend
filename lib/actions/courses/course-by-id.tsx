import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const getCourseById = async (id: number | string | null) => {
  console.log("id", id);
  return instance.get(`/courses/${id}`);
};

export const useGetCourseById = (id: number | string | null) => {
  return useQuery({
    queryKey: ["get-course-by-id", id],
    enabled: !!id,
    queryFn: () => getCourseById(id),
  });
};
