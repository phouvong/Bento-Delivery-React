import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import MainApi from "api-manage/MainApi";
import { top_offer_near_me } from "api-manage/ApiRoutes";

const getTopOffers = async (sortby,searchKey,type) => {
	const { data } = await MainApi.get(`${top_offer_near_me}?sort_by=${sortby}&name=${searchKey}&type=${type!=="halal" ? type : ""}&halal=${type==="halal" ? 1 : 0}`);
	return data;
};

export default function useGetTopOffers(sortby,searchKey,type) {
	return useQuery(["top-offer-near-me"], () => getTopOffers(sortby,searchKey,type), {
		enabled: false,
		onError: onSingleErrorResponse,
	});
}
