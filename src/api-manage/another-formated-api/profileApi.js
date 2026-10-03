import MainApi from "../MainApi";
import {getToken} from "../../helper-functions/getToken";
import { getApiContent } from "../getApiContent";

// Callers read `response.data` and expect the customer object — AuthModal does
// `dispatch(setUser(res?.data))` right after login. v4.2 nests it in `content`.
const unwrap = (request) =>
  request.then((response) => ({
    ...response,
    data: getApiContent(response?.data),
  }));

export const ProfileApi = {
  profileInfo: () => {
    const token = getToken();
    return token && unwrap(MainApi.get("/api/v1/customer/info"));
  },
  profileUpdate: (profileData) =>
    unwrap(MainApi.post("/api/v1/customer/update-profile", profileData)),
};
