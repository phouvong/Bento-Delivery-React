import { useQuery } from "react-query";
import { cashback_list } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async () => {
	const { data } = await MainApi.get(cashback_list);
	return data;
};

export default function useGetCashbackList(handleSuccess) {
	return useQuery("cashback", () => getData(), {
		enabled: false,
		staleTime: 10000,
		cacheTime: 5000,
		onSuccess: handleSuccess,
		onError: onSingleErrorResponse,
	});
}
