import { useQuery } from "react-query";
import { pro_terms } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const getProTermsAndConditions = async () => {
  const { data } = await MainApi.get(pro_terms);
  return data;
};

export const useGetProTermsAndConditions = ({ enabled = true } = {}) => {
  return useQuery(
    "pro-customer-terms-and-conditions",
    getProTermsAndConditions,
    {
      enabled,
      onError: onErrorResponse,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Backend may return raw HTML string, `{ content }`, `{ description }`,
// `{ page_description }`, or any of those wrapped in an axios-style
// `{ data }` envelope. Flatten here so the call site renders one body
// without nested null checks.
const unwrap = (raw) => {
  if (!raw) return null;
  if (typeof raw === "string") return raw;
  const inner = raw?.data !== undefined ? raw.data : raw;
  return inner ?? null;
};

export const resolveTermsBody = (raw) => {
  const inner = unwrap(raw);
  if (!inner) return "";
  if (typeof inner === "string") return inner;
  return inner.page_description ?? inner.content ?? inner.description ?? "";
};

export const resolveTermsTitle = (raw) => {
  const inner = unwrap(raw);
  if (!inner || typeof inner === "string") return "";
  return inner.page_title ?? inner.title ?? "";
};

export const resolveTermsImage = (raw) => {
  const inner = unwrap(raw);
  if (!inner || typeof inner === "string") return "";
  return inner.page_image_full_url ?? inner.image_full_url ?? inner.image ?? "";
};

// Backend uses page_status === 1 to mean the terms page is published; 0
// means draft/disabled. Default to enabled when the flag is absent so old
// shapes keep working.
export const resolveTermsEnabled = (raw) => {
  const inner = unwrap(raw);
  if (!inner || typeof inner === "string") return true;
  if (inner.page_status === undefined) return true;
  return Number(inner.page_status) === 1;
};

export default useGetProTermsAndConditions;
