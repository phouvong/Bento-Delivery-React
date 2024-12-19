import { brand_products } from "api-manage/ApiRoutes";
import { useQuery } from "react-query";
import { getToken } from "../../../../helper-functions/getToken";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (id) => {
	const userToken = getToken();
	const { data } = await MainApi.get(brand_products + id);
	return data;
};

export default function useGetBrandProducts({ id }) {
	return useQuery("get-brandlists", () => getData(id), {
		enabled: false,
		onError: onSingleErrorResponse,
	});
}
