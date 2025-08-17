import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { surge_price } from "api-manage/ApiRoutes";
import moment from "moment";

const getSurge = async (orderData) => {
  const tempData = {
    ...orderData,
    date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  const { data } = await MainApi.post(`${surge_price}`, tempData);
  return data;
};

export const useGetSurgePrice = () => {
  return useMutation("get-surge", getSurge);
};
