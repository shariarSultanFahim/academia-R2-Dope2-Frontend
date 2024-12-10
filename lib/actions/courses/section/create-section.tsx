import { useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "../..";

export const useCreateSection = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: {
			course_title: string;
			course_description?: string;
			course_cover_url?: string;
			course_start_date: string;
			course_end_date: string;
			course_code: string;
			course_credits: number;
			course_status: string;
		}) => {
			const courseStartDate = new Date(data.course_start_date);
			const courseEndDate = new Date(data.course_end_date);

			return instance.post("/courses", {
				...data,
				course_start_date: courseStartDate,
				course_end_date: courseEndDate,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-list-courses"],
			});
		},
	});
};
