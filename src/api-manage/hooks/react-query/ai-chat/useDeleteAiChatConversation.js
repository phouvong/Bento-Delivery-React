import { useMutation } from "react-query";

import { getGuestId } from "../../../../helper-functions/getToken";
import MainApi from "../../../MainApi";
import { ai_chat_conversations_api } from "../../../ApiRoutes";

const deleteAiChatConversation = async (conversationId) => {
  const { data } = await MainApi.delete(
    `${ai_chat_conversations_api}/${conversationId}`,
    { params: { guest_id: getGuestId() } }
  );
  return data;
};

const useDeleteAiChatConversation = (options = {}) => {
  return useMutation(deleteAiChatConversation, options);
};

export default useDeleteAiChatConversation;
