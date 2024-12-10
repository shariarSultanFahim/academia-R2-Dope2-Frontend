import { useMutation } from "@tanstack/react-query";
import instance from "..";

export const logout = () => {
	return instance.get("/auth/logout");
};

export const useLogout = () => {
	return useMutation({ mutationFn: logout });
};
