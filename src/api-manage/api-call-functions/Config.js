import MainApi from "../MainApi";
import { config_api } from "../ApiRoutes";
import { getApiContent } from "../getApiContent";

// Returns the raw axios response (callers read `response.data`), so unwrap the
// v4.2 envelope in place and leave the rest of the response untouched.
export const ConfigApi = {
  config: () =>
    MainApi.get(config_api).then((response) => ({
      ...response,
      data: getApiContent(response?.data),
    })),
};
