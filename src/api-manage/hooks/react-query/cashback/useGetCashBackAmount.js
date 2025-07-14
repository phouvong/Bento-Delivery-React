import { getToken } from "helper-functions/getToken";
import { useQuery } from "react-query";
import { cashback_amount } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (amount) => {
	const userToken = getToken();
	if (userToken) {
		const { data } = await MainApi.get(cashback_amount + "?amount=" + amount);
		return data;
	}
};

export default function useGetCashBackAmount({ amount, handleSuccess }) {
	return useQuery("cashback", () => getData(amount), {
		enabled: false,
		onSuccess: handleSuccess,
		onError: onSingleErrorResponse,
	});
}
