import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

export const useCreateSection = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: {
			course_id: number;
			section_title: string;
			section_description?: string | null;
			section_total_seats?: string | null;
		}) => {
			return instance.post("/sections", {...data});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-section-by-id"],
			});
		},
	});
};
