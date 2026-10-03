import { useInfiniteQuery, useQuery } from "react-query";

import { get_conversations_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiCollection } from "../../../getApiContent";

const getData = async (params, pageParam) => {
  const { channelId, apiFor, page_limit, offset } = params;

  const { data } = await MainApi.get(
    `${get_conversations_api}?${apiFor}=${
      channelId === "admin" ? 0 : channelId
    }?&offset=${pageParam}&limit=${page_limit}`
  );
  // The old API returned the rows under `messages`; v4.2 puts them at
  // content.data alongside `status`/`conversation`. Alias them back so
  // getNextPageParam and the message list both keep working, and keep the
  // siblings the conversation header reads.
  return getApiCollection(data, "messages");
};
export const useGetConversation = (params) => {
  return useInfiniteQuery(
    "get_conversation",
    ({ pageParam = params.offset }) => getData(params, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage?.messages?.length > 0 ? nextPage : undefined;
      },
      enabled: false,
      onError: onErrorResponse,
    }
  );
};
