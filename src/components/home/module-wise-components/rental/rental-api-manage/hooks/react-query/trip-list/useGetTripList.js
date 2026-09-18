import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { trip_list } from "../../../ApiRoutes";
import { data_limit } from "api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";

const getData = async (pageParams) => {
	const { orderType, offset } = pageParams;
	const { data } = await MainApi.get(
		`${trip_list}/${orderType}?limit=${data_limit}&offset=${offset}`
	);
	return data;
};

export default function useGetTripList(pageParams) {
	return useQuery(
		["my-trip-list", pageParams?.orderType],
		() => getData(pageParams),
		{
			staleTime: 60000,
			cacheTime: 50000,
			enabled: false,
			onError: onSingleErrorResponse,
		}
	);
}
