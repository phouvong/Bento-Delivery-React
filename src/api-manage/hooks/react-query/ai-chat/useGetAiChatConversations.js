import { useQuery } from "react-query";

import { getGuestId } from "../../../../helper-functions/getToken";
import MainApi from "../../../MainApi";
import { ai_chat_conversations_api } from "../../../ApiRoutes";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const fetchAiChatConversations = async ({ limit = 20, offset = 1 } = {}) => {
  const { data } = await MainApi.get(ai_chat_conversations_api, {
    params: { limit, offset, guest_id: getGuestId() },
  });
  return data;
};

const useGetAiChatConversations = ({
  enabled = false,
  limit = 20,
  offset = 1,
} = {}) => {
  return useQuery(
    ["ai-chat-conversations", limit, offset],
    () => fetchAiChatConversations({ limit, offset }),
    {
      enabled,
      onError: onErrorResponse,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetAiChatConversations;
