import MainApi from "../../../MainApi";
import { popular_provider, typewise_store_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getApiCollection } from "../../../getApiContent";
const getData = async (storeType, type) => {
  const { data } = await MainApi.get(
    `${getCurrentModuleType() === "rental" ? "api/v1/rental/provider" : typewise_store_api}/${storeType}?type=${type}`
  );
  return getApiCollection(data, "stores");
};

export default function useGetTypeWiseStore(storeType, type) {
  return useQuery("type-wise-store", () => getData(storeType, type), {
    enabled: false,
  });
}
