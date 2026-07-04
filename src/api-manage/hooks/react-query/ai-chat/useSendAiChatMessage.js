import { useMutation } from "react-query";

import { getGuestId } from "../../../../helper-functions/getToken";
import MainApi from "../../../MainApi";
import { ai_chat_send_api } from "../../../ApiRoutes";

const sendAiChatMessage = async ({ conversationId, message }) => {
  const payload = { message, guest_id: getGuestId() };
  if (conversationId) payload.conversation_id = conversationId;
  const { data } = await MainApi.post(ai_chat_send_api, payload);
  return data;
};

const useSendAiChatMessage = (options = {}) => {
  return useMutation(sendAiChatMessage, options);
};

export default useSendAiChatMessage;
