import { brand_list } from "api-manage/ApiRoutes";
import { useQuery } from "react-query";
import { getToken } from "../../../../helper-functions/getToken";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async () => {
	const userToken = getToken();
	const { data } = await MainApi.get(brand_list);
	return data;
};

export default function useGetBrandsList(handleSuccess) {
	return useQuery("get-brandlists", () => getData(), {
		enabled: false,
		onSuccess: handleSuccess,
		onError: onSingleErrorResponse,
	});
}
