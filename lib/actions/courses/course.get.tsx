import { useQuery } from "@tanstack/react-query";
import instance from "..";

interface GetCourseParams {
  page?: number;
}

export const useGetCourses = (params?: GetCourseParams) => {
  return useQuery({
    queryKey: ["get-list-courses", params],
    queryFn: () =>
      instance.get("/courses", {
        params,
      }),
  });
};
