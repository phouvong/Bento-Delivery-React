import { useQuery } from "react-query";
import { pro_faqs } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const getProFaqs = async () => {
  const { data } = await MainApi.get(pro_faqs);
  return data;
};

export const useGetProFaqs = ({ enabled = true } = {}) => {
  return useQuery("pro-customer-faqs", getProFaqs, {
    enabled,
    onError: onErrorResponse,
    staleTime: 5 * 60 * 1000,
  });
};

// Backend keys the question/answer fields inconsistently across versions —
// resolve whichever variant is present so call sites stay simple.
export const resolveFaq = (faq) => ({
  question: faq?.question ?? faq?.q ?? faq?.title ?? "",
  answer: faq?.answer ?? faq?.a ?? faq?.description ?? "",
});

// Endpoint may return a bare array, a `{ data: [] }` envelope, a `{ faqs: [] }`
// envelope (with pagination metadata around it), or a nested `{ data: { faqs: [] } }`.
export const toFaqList = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.faqs)) return raw.faqs;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw?.data && Array.isArray(raw.data.faqs)) return raw.data.faqs;
  return [];
};

export default useGetProFaqs;
