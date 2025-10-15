import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import MainApi from "api-manage/MainApi";
import { top_offer_near_me } from "api-manage/ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";

const getTopOffers = async (sortby,searchKey,type) => {
	const { data } = await MainApi.get(`${top_offer_near_me}?sort_by=${sortby}&name=${searchKey}&type=${type!=="halal" ? type : ""}&halal=${type==="halal" ? 1 : 0}`);
	return data;
};

export default function useGetTopOffers(sortby,searchKey,type) {
	return useQuery(["top-offer-near-me",getModuleId()], () => getTopOffers(sortby,searchKey,type), {
		enabled: true,
		staleTime: 60 * 1000,
		cacheTime: 60 * 1000,
		onError: onSingleErrorResponse,
	});
}
