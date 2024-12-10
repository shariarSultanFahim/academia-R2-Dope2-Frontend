import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

const deleteUser = (id: number) => {
  return instance.delete(`/users/${id}`);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Query invalidation
      queryClient.invalidateQueries({
        queryKey: ["get-list-users"],
      });
    },
  });
};