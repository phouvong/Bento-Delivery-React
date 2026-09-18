import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { data_limit, service_booking_list_api } from "../../../ApiRoutes";
import MainApi from "api-manage/MainApi";

const PAGE_SIZE = Number(data_limit);

// The API filters by a single `status` value and has no built-in "running" /
// "history" grouping (nor aggregate counts for one). These groups are our own
// UI concept, merged client-side from the underlying statuses:
//  - running: not finished yet
//  - previous (History tab): terminal
const STATUS_GROUPS = {
  running: ["pending", "confirmed", "ongoing"],
  previous: ["completed", "canceled"],
};

// GET /api/v1/service/booking/list?limit&offset&status&payment_status&payment_method
//   &booking_type&multi_booking_type&scheduled&zone_id&only_parent&parent_booking_id
//   &date_filter&from&to&search
const buildQuery = ({
  offset,
  limit,
  status,
  payment_status,
  payment_method,
  booking_type,
  multi_booking_type,
  scheduled,
  zone_id,
  only_parent,
  parent_booking_id,
  date_filter,
  from,
  to,
  search,
}) => {
  const query = new URLSearchParams();
  query.set("limit", String(limit ?? PAGE_SIZE));
  query.set("offset", String(offset ?? 1));
  // "all" tab means "no filter" — omit the param.
  if (status && status !== "all") query.set("status", status);
  if (payment_status) query.set("payment_status", payment_status);
  if (payment_method) query.set("payment_method", payment_method);
  if (booking_type) query.set("booking_type", booking_type);
  if (multi_booking_type) query.set("multi_booking_type", multi_booking_type);
  if (scheduled !== undefined && scheduled !== null && scheduled !== "")
    query.set("scheduled", String(scheduled));
  if (zone_id) query.set("zone_id", zone_id);
  if (only_parent) query.set("only_parent", "1");
  if (parent_booking_id) query.set("parent_booking_id", parent_booking_id);
  if (date_filter) query.set("date_filter", date_filter);
  // `from`/`to` are only meaningful (and required by the API) for date_filter=custom.
  if (date_filter === "custom") {
    if (from) query.set("from", from);
    if (to) query.set("to", to);
  }
  if (search) query.set("search", search);
  return query;
};

const fetchPage = async (params) => {
  const query = buildQuery(params);
  const { data } = await MainApi.get(
    `${service_booking_list_api}?${query.toString()}`
  );
  return { bookings: data?.bookings ?? [], total_size: data?.total_size ?? 0 };
};

const getData = async (params) => {
  const { offset = 1, tab } = params ?? {};
  const group = STATUS_GROUPS[tab];

  if (!group) {
    // "all" tab, or an explicit single `status` filter — one direct call, API paginates.
    const { bookings, total_size } = await fetchPage(params);
    return { bookings, total_size, limit: PAGE_SIZE, offset };
  }

  // Grouped tab (Running/History): fetch each underlying status far enough to
  // cover this page, merge, sort by created_at, then slice out the requested
  // page ourselves — the API can't paginate a merged multi-status query for us.
  const upTo = offset * PAGE_SIZE;
  const pages = await Promise.all(
    group.map((status) =>
      fetchPage({ ...params, status, offset: 1, limit: upTo })
    )
  );

  const merged = pages
    .flatMap((p) => p.bookings)
    .sort((a, b) => new Date(b?.created_at ?? 0) - new Date(a?.created_at ?? 0));

  const total_size = pages.reduce((sum, p) => sum + p.total_size, 0);
  const start = (offset - 1) * PAGE_SIZE;

  return {
    bookings: merged.slice(start, start + PAGE_SIZE),
    total_size,
    limit: PAGE_SIZE,
    offset,
  };
};

export default function useGetServiceBookingList(params, enabled = true) {
  return useQuery(
    [
      "service-booking-list",
      params?.tab,
      params?.status,
      params?.payment_status,
      params?.payment_method,
      params?.booking_type,
      params?.multi_booking_type,
      params?.scheduled,
      params?.zone_id,
      params?.only_parent,
      params?.parent_booking_id,
      params?.date_filter,
      params?.from,
      params?.to,
      params?.search,
      params?.offset,
    ],
    () => getData(params),
    {
      staleTime: 60000,
      cacheTime: 50000,
      enabled,
      onError: onSingleErrorResponse,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    }
  );
}
