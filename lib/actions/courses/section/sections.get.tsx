import { useQuery } from "@tanstack/react-query";
import instance from "../..";

interface GetSectionsParams {
  course_id: number | string;
  page?: number;
}

export const useGetSections = (params?: GetSectionsParams) => {
	return useQuery({
		queryKey: ["get-section-by-id", params],
			queryFn: () =>
				instance.get("/sections", {
					params,
				}),
	});
};
