import { getToken } from "helper-functions/getToken";
import { useQuery } from "react-query";
import { cashback_amount } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiContent } from "../../../getApiContent";

const getData = async (amount) => {
	const userToken = getToken();
	if (userToken) {
		const { data } = await MainApi.get(cashback_amount + "?amount=" + amount);
		return getApiContent(data);
	}
};

export default function useGetCashBackAmount({ amount, handleSuccess }) {
	// Keyed on `amount` so a stale in-flight request can't overwrite a newer one's cache slot.
	return useQuery(["cashback", amount], () => getData(amount), {
		enabled: false,
		onSuccess: handleSuccess,
		onError: onSingleErrorResponse,
	});
}
