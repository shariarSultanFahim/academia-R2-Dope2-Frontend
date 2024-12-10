import { CourseFormValues } from "@/app/app/admin/courses/[id]/components/create-section";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseFormValues) => {
      return instance.post("/sections", { ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-section-by-id"],
      });
    },
  });
};
