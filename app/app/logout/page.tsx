"use client";
import { useEffect } from "react";
import { authService } from "@/lib/auth.service";
import { useRouter } from "next/navigation";
import { Loading } from "../token-validation-checker";
import { useLogout } from "@/lib/actions/auth/logout.get";
import { useQueryClient } from "@tanstack/react-query";

export default function SignoutPage() {
	const router = useRouter();
	const { mutateAsync } = useLogout();
	const queryClient = useQueryClient();

	const logout = async () => {
		try {
			await mutateAsync();
		} catch (err) {
			console.error(err);
		}
		authService.removeToken();
		queryClient.clear();
		router.refresh();
	};

	useEffect(() => {
		logout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <Loading />;
}
