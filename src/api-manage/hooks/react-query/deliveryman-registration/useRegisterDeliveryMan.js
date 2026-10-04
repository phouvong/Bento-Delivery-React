import { delivery_man_registaration } from "api-manage/ApiRoutes";
import MainApi from "api-manage/MainApi";
import { useMutation } from "react-query";

const postHandler = async (info) => {
	const { data } = await MainApi.post(`${delivery_man_registaration}`, info);
	return data;
};
export const usePostDeliveryManRegisterInfo = () => {
	return useMutation("deliveryman_post_request", postHandler);
};
