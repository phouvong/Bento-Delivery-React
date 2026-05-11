import { useMutation, useQueryClient } from "react-query";
import { saved_files_delete_all_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const deleteAll = async () => {
  const { data } = await MainApi.delete(saved_files_delete_all_api);
  return data;
};

export const useDeleteAllSavedFiles = () => {
  const queryClient = useQueryClient();
  return useMutation("delete_all_saved_files", deleteAll, {
    onSuccess: () => {
      queryClient.invalidateQueries("get_saved_files");
    },
  });
};
