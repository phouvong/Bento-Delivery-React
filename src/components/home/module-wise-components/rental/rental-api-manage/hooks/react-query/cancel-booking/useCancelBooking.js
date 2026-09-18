import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { trip_cancel_booking } from "../../../ApiRoutes";

const addData = async (postData) => {
	const { data } = await MainApi.put(trip_cancel_booking, postData);
	return data;
};

export default function useCancelBooking() {
	return useMutation("cancel-trip", addData);
}
