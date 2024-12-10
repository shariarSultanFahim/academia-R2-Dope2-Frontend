import { useQuery } from "@tanstack/react-query";
import instance from "..";

export const useValidate = () => {
	return useQuery({
		queryKey: ["validate"],
		queryFn: () => {
			return instance.get("/auth/validate");
		},
	});
};
