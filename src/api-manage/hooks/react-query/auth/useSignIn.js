import { useMutation } from "react-query";
import { signIn_api, signUp_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

import { getApiContent } from "api-manage/getApiContent";

// Auth responses carry the payload in `content` (token, is_personal_info, …)
// while `message` stays on the envelope and some handlers toast it. Expose
// both, payload winning on conflict. Only success responses pass through —
// axios rejects on failure, so `error.response.data.message` is unaffected.
const unwrapAuth = (envelope) => {
  const content = getApiContent(envelope);
  const isObject =
    !!content && typeof content === "object" && !Array.isArray(content);
  return isObject ? { message: envelope?.message, ...content } : content;
};


const userSignIn = async (signInData) => {
	const { data } = await MainApi.post(`${signIn_api}`, signInData);
	return unwrapAuth(data);
};
export const useSignIn = (handleError) => {
	return useMutation("sign-In", userSignIn, {
		onError: handleError,
	});
};
