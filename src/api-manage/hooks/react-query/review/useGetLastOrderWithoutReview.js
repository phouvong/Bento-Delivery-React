import { getToken } from "helper-functions/getToken";
import { useQuery } from "react-query";
import { last_item_review } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (id) => {
	const userToken = getToken();
	if (userToken) {
		const { data } = await MainApi.get(`${last_item_review}`);
		return data;
	}
};

export default function useGetLastOrderWithoutReview(reviewReminder) {
	return useQuery("review", () => getData(), {
		enabled: false,
		onSuccess: reviewReminder,
		onError: onSingleErrorResponse,
	});
}
