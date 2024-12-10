import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const update = ({ id, data }: { id: number | string; data: any }) => {
	return instance.patch(`/sections/${id}`, { ...data });
};

export const useUpdateSection = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: update,
		onSuccess: () => {
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: ["get-section-by-id","get-list-courses"],
			});
		},
	});
};
