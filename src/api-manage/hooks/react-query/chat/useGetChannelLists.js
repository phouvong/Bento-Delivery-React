import { useQuery } from "react-query";

import MainApi from "../../../MainApi";
import { get_channel_list } from "../../../ApiRoutes";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiList } from "../../../getApiContent";

const getData = async () => {
  const { data } = await MainApi.get(`${get_channel_list}`);
  // Consumers call `.length` / `.find()` on this, and `content` can be
  // null, so always hand back an array.
  return getApiList(data) ?? [];
};
export const useGetChannelList = (handleRequestOnSuccess) => {
  return useQuery("get_channel_list", () => getData(), {
    enabled: false,
    onSuccess: handleRequestOnSuccess,
    onError: onErrorResponse,
  });
};
