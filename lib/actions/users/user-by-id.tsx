import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const getUserById = async (id: number | string | null) => {
  return instance.get(`/users/${id}`);
};

export const useGetUserById = (id: number | string | null) => {
  return useQuery({
    queryKey: ["get-user-by-id", id],
    enabled: !!id,
    queryFn: () => getUserById(id),
  });
};
