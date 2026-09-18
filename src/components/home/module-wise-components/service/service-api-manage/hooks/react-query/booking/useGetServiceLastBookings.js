import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { last_booking_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";

const fetchServiceLastBookings = async (provider_id, limit, offset) => {
  const params = new URLSearchParams();
  if (provider_id) params.append("provider_id", provider_id);
  params.append("limit", limit);
  params.append("offset", offset);
  const url = `${last_booking_api}?${params.toString()}`;
  const { data } = await MainApi.get(url);
  return data;
};

const useGetServiceLastBookings = ({
  provider_id,
  limit = 20,
  offset = 1,
  canRebook,
} = {}) => {
  return useQuery(
    ["service-last-bookings", provider_id, limit, offset, canRebook],
    () => fetchServiceLastBookings(provider_id, limit, offset),
    {
      select: (res) => {
        const list = res?.bookings ?? res ?? [];
        if (!Array.isArray(list)) return [];
        if (canRebook) {
          list.filter((o) => o?.can_rebook);
        }
        // return list.filter((o) => o?.can_rebook);
        return list;
      },
      onError: onSingleErrorResponse,
    },
  );
};

export default useGetServiceLastBookings;
