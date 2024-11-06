import { useQuery } from "react-query";

import MainApi from "api-manage/MainApi";
import { zone_list } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const getZoneList = async () => {
	const { data } = await MainApi.get(`${zone_list}`);
	return data;
};

export default function useGetZoneList() {
	return useQuery(["zone-list-data"], () => getZoneList(), {
		enabled: false,
		onError: onSingleErrorResponse,
	});
}
