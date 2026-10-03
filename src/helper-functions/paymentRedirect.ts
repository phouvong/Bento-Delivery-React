import { getApiContent } from "api-manage/getApiContent";

/**
 * Digital-payment endpoints answer with the gateway URL the browser has to be
 * sent to. The shape it arrives in differs per caller and per API version:
 *
 *   pre-4.2   the bare URL string as the whole response body
 *   v4.2      `{ …envelope, content: { redirect_link: "…" } }`
 *   axios     either of the above still wrapped in `response.data`
 *
 * `rental/user/trip/payment` was the last path still pushing the raw response
 * into the router, which under v4.2 handed Next a `{ redirect_link }` object
 * with no `pathname` — the gateway hop silently did nothing. Everything that
 * follows a payment redirect should resolve it through here instead.
 */

const isUrlLike = (value: string) =>
  /^(https?:)?\/\//i.test(value) || value.startsWith("/");

const pickLink = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    // A bare string is only a redirect if it actually looks like one — the same
    // slot can carry a plain success message on the cash/wallet branches.
    return trimmed && isUrlLike(trimmed) ? trimmed : undefined;
  }
  if (value && typeof value === "object") {
    const link = (value as { redirect_link?: unknown }).redirect_link;
    if (typeof link === "string" && link.trim()) return link.trim();
  }
  return undefined;
};

export const getRedirectLink = (response: unknown): string | undefined => {
  const data = (response as { data?: unknown })?.data;
  const candidates = [
    response,
    getApiContent<unknown>(response),
    data,
    getApiContent<unknown>(data),
  ];

  for (const candidate of candidates) {
    const link = pickLink(candidate);
    if (link) return link;
  }
  return undefined;
};

/**
 * Gateways live on the API host, so the hop out of the app is a full-page
 * navigation — the rental cart, checkout and provider banners all already do
 * this. Only a same-app path stays on the client router.
 */
export const followPaymentRedirect = (
  link: string,
  router?: { push: (url: string) => void }
) => {
  if (typeof window === "undefined" || !link) return;
  if (link.startsWith("/") && router) {
    router.push(link);
    return;
  }
  window.location.href = link;
};

export default getRedirectLink;
