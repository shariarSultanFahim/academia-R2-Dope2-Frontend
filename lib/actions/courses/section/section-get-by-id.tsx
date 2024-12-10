import { useQuery } from "@tanstack/react-query";
import instance from "../..";

export const getSectionById = async (id: number | string | null) => {
  return instance.get(`/sections/${id}`);
};

export const useGetSectionById = (id: number | string | null | string[]) => {
  return useQuery({
    queryKey: ["get-course-by-id", id],
    enabled: !!id,
    queryFn: () => getSectionById(id),
  });
};
