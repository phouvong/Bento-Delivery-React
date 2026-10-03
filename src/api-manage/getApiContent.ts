/**
 * From v4.2 the `api/v1` endpoints wrap successful payloads in a standard
 * envelope: `{ identical_code, message, content, errors }`. Earlier builds
 * returned the payload directly, so unwrap only when the envelope is actually
 * present and hand the raw response back otherwise.
 */
export interface ApiEnvelope<T> {
  identical_code?: string;
  message?: string;
  content?: T;
  errors?: unknown;
}

export interface ApiPaginatedContent<T> {
  data: T[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  !!value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const isApiEnvelope = <T>(value: unknown): value is ApiEnvelope<T> => {
  const record = asRecord(value);
  return (
    !!record &&
    "content" in record &&
    ("identical_code" in record || "errors" in record)
  );
};

export const getApiContent = <T>(response: ApiEnvelope<T> | T): T | undefined =>
  isApiEnvelope<T>(response) ? response.content : (response as T);

/**
 * `message` stays on the envelope while the payload moves into `content`, so a
 * handler holding an unwrapped payload has no message to toast and one holding
 * an axios response has it two levels up. Look in every place it can sit.
 */
export const getApiMessage = (response: unknown): string | undefined => {
  const fromRecord = (value: unknown): string | undefined => {
    const record = asRecord(value);
    const message = record?.message;
    return typeof message === "string" && message.trim() ? message : undefined;
  };

  const data = asRecord(response)?.data;
  return (
    fromRecord(response) ??
    fromRecord(data) ??
    fromRecord(getApiContent<unknown>(response)) ??
    fromRecord(getApiContent<unknown>(data))
  );
};

/**
 * List endpoints nest their rows one level deeper again — `content.data`
 * alongside `content.pagination`. Returns the rows from either the v4.2 shape
 * or a legacy bare array, and `undefined` when neither is present so callers
 * can keep distinguishing "not loaded yet" from "loaded but empty".
 */
export const getApiList = <T>(response: unknown): T[] | undefined => {
  const content = getApiContent<unknown>(response);
  if (Array.isArray(content)) return content as T[];

  const record = asRecord(content);
  if (record && Array.isArray(record.data)) return record.data as T[];

  return undefined;
};

/**
 * v4.2 also renamed the list payload itself: the rows moved from a per-resource
 * key (`stores`, `products`, …) to `data`, and `total_size` / `limit` / `offset`
 * were replaced by a `pagination` object. Components across the app still read
 * the old names, so return a superset carrying both vocabularies — the new
 * `data` / `pagination` plus the legacy alias and counters.
 *
 * `legacyKey` is the collection name the consuming components expect, e.g.
 * "stores" for store lists or "products" for item lists. Endpoints that serve
 * either kind depending on a tab (discounted items, top offers) can pass both
 * names — the rows are whatever that call asked for, so aliasing them under
 * each is safe.
 */
export const getApiCollection = <T>(
  response: unknown,
  legacyKey?: string | string[]
) => {
  const content = getApiContent<unknown>(response);
  if (content === undefined || content === null) return content as undefined;

  const record = asRecord(content);
  const rows = Array.isArray(content)
    ? (content as T[])
    : record && Array.isArray(record.data)
      ? (record.data as T[])
      : null;

  // Not a list payload after all — hand the content back untouched.
  if (!rows) return content as any;

  const pagination = (record?.pagination as ApiPaginatedContent<T>["pagination"]) ?? undefined;
  // Some list endpoints carry siblings next to `data` — `min_price`/`max_price`
  // on rental vehicle lists, `provider` on provider reviews, `rating_summary`
  // on reviews. Spread the original content first so none of them are lost.
  const collection: Record<string, unknown> = {
    ...(record ?? {}),
    data: rows,
    pagination,
    total_size: pagination?.total ?? rows.length,
    limit: pagination?.per_page,
    offset: pagination?.current_page,
  };
  const aliases = Array.isArray(legacyKey) ? legacyKey : legacyKey ? [legacyKey] : [];
  aliases.forEach((alias) => {
    collection[alias] = rows;
  });
  return collection as any;
};

export default getApiContent;
