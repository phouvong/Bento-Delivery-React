import MainApi from "../../../MainApi";
import { useQuery } from "react-query";
import { parcel_category_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getParcelCategory = async () => {
  const { data } = await MainApi.get(parcel_category_api);
  return data;
};

export default function useGetParcelCategory() {
  return useQuery("parcel-categorys", getParcelCategory, {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
