import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import { saved_files_list } from "api-manage/ApiRoutes";

const getData = async () => {
  const { data } = await MainApi.get(saved_files_list);
  return data;
};

export const useGetSavedFiles = () => {
  return useQuery("get_saved_files", getData, {
    staleTime: 0,
    refetchOnMount: true,
    onError: onErrorResponse,
  });
};
