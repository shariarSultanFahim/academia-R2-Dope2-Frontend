import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "..";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const update = ({ id, data }: { id: number | string; data: any }) => {
	console.log("data", data);
	return instance.patch(`/courses/${id}`, { ...data });
};

export const useUpdateCourse = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: update,
		onSuccess: () => {
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: ["get-list-courses", "get-course-by-id"],
			});
		},
	});
};
