import { useInfiniteQuery } from "react-query";

import { getGuestId } from "../../../../helper-functions/getToken";
import MainApi from "../../../MainApi";
import { ai_chat_messages_api } from "../../../ApiRoutes";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const fetchAiChatMessages = async ({ conversationId, offset, limit }) => {
  const { data } = await MainApi.get(ai_chat_messages_api, {
    params: {
      conversation_id: conversationId,
      offset,
      limit,
      guest_id: getGuestId(),
    },
  });
  return data;
};

const useGetAiChatMessages = ({
  conversationId,
  enabled = true,
  limit = 10,
  messagesCount = 0,
}) => {
  const initialOffset = Math.max(
    1,
    Math.ceil(Number(messagesCount || 0) / limit) || 1
  );

  return useInfiniteQuery(
    ["ai-chat-messages", conversationId, initialOffset],
    ({ pageParam }) =>
      fetchAiChatMessages({
        conversationId,
        offset: pageParam ?? initialOffset,
        limit,
      }),
    {
      enabled: enabled && Boolean(conversationId),
      onError: onErrorResponse,
      refetchOnWindowFocus: false,
      getPreviousPageParam: (firstPage) => {
        const currentOffset = Number(firstPage?.offset ?? initialOffset);
        return currentOffset > 1 ? currentOffset - 1 : undefined;
      },
      getNextPageParam: () => undefined,
    }
  );
};

export default useGetAiChatMessages;
