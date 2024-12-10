import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

const deleteSection = (id: number) => {
  return instance.delete(`/sections/${id}`);
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-section-by-id"],
      });
    },
  });
};
