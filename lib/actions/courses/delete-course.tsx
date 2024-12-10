import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const deleteCourse = (id: number) => {
  return instance.delete(`/courses/${id}`);
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-list-courses"],
      });
    },
  });
};
