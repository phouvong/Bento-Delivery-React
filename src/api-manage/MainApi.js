import axios from "axios";
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const MainApi = axios.create({
  baseURL: baseUrl,
});
MainApi.interceptors.request.use(function (config) {
  let zoneid = undefined;
  let token = undefined;
  let language = undefined;
  let currentLocation = undefined;
  let software_id = 33571750;
  let hostname = process.env.NEXT_CLIENT_HOST_URL;
  let moduleid = undefined;

  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
    token = localStorage.getItem("token");
    language = JSON.parse(localStorage.getItem("language-setting"));
    currentLocation = JSON.parse(localStorage.getItem("currentLatLng"));
    moduleid = JSON.parse(localStorage.getItem("module"))?.id;
  }
  config.headers.latitude = currentLocation?.lat || 0
    config.headers.longitude = currentLocation?.lng || 0
  const zoneidIsValid =
    zoneid &&
    zoneid !== "undefined" &&
    zoneid !== "null" &&
    !/nan/i.test(zoneid) &&
    (() => {
      try {
        const parsed = JSON.parse(zoneid);
        return (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((id) => !Number.isNaN(Number(id)))
        );
      } catch {
        return false;
      }
    })();
  if (zoneidIsValid) {
    config.headers.zoneid = zoneid;
  }
  if (moduleid) config.headers.moduleId = moduleid;
  if (token) config.headers.authorization = `Bearer ${token}`;
  if (language) config.headers["X-localization"] = language;
  if (hostname) config.headers["origin"] = hostname;
  config.headers["X-software-id"] = software_id;
  config.headers["Accept"] = 'application/json'
  config.headers["ngrok-skip-browser-warning"] = true;
  return config;
});
MainApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.errors?.[0]?.message;
    if (typeof window !== "undefined" && status === 422 ) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);


export default MainApi;
