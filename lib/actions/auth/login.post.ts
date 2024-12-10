import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

export const useLogin = () => {
	const queryclient = useQueryClient();
	return useMutation({
		mutationFn: (data: { email: string; password: string }) =>
			instance.post("/auth/login", { ...data }),
		onSuccess: () => {
			queryclient.invalidateQueries({
				queryKey: ["get-list-users"],
			});
		},
	});
};
