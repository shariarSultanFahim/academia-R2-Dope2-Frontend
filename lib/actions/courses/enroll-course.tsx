import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

export const useEnrollToCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
        section_id: number,
        user_id: number,
        enrollment_status: string
    }) => {

      return instance.post("/course-enrollment",{...data})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-list-courses"],
      });
    },
  });
};
