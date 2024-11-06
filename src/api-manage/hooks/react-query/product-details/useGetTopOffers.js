import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import MainApi from "api-manage/MainApi";
import { top_offer_near_me } from "api-manage/ApiRoutes";

const getTopOffers = async () => {
	const { data } = await MainApi.get(`${top_offer_near_me}`);
	return data;
};

export default function useGetTopOffers() {
	return useQuery(["top-offer-near-me"], () => getTopOffers(), {
		enabled: false,
		onError: onSingleErrorResponse,
	});
}
