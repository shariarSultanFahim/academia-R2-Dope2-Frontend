import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";
import { UsersFormValues } from "@/app/app/admin/users/(list)/create-users";

export const useCreateUser = () => {
	const queryclient = useQueryClient();
	return useMutation({
		mutationFn: (data: UsersFormValues) => instance.post("/users", { ...data }),
		onSuccess: () => {
			queryclient.invalidateQueries({
				queryKey: ["get-list-users"],
			});
		},
	});
};
