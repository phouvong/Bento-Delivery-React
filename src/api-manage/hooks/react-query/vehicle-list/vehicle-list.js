import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import MainApi from "api-manage/MainApi";
import { vehicle_list } from "api-manage/ApiRoutes";

const getVehicleList = async () => {
	const { data } = await MainApi.get(`${vehicle_list}`);
	return data;
};

export default function useGetVehicleList() {
	return useQuery(["vehicle-list-data"], () => getVehicleList(), {
		enabled: false,
		onError: onSingleErrorResponse,
	});
}
