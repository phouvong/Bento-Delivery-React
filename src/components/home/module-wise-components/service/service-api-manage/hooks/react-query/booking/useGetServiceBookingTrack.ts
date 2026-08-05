import { useQuery, UseQueryResult } from "react-query";
import MainApi from "api-manage/MainApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { service_booking_track_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";

export interface ServiceBookingTrackAmount {
  booking_amount: number;
  discount_amount: number;
  coupon_discount_amount: number;
  pro_discount: number;
  ref_bonus_amount: number;
  tax_amount: number;
  tax_status: "excluded" | "included";
  additional_charge: number;
  partially_paid_amount: number;
}

export interface ServiceBookingTrackProvider {
  id: number;
  name: string;
  phone: string;
  logo_full_url: string | null;
}

export interface ServiceBookingTrackCustomer {
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
  email: string | null;
  image_full_url: string | null;
}

export interface ServiceBookingTrackServiceman {
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
}

export interface ServiceBookingTrackDetail {
  id: number;
  service_id: number;
  service_name: string;
  is_custom: boolean;
  category_id: number | null;
  sub_category_id: number | null;
  quantity: number;
  price: number;
  original_price: number;
  calculated_price: number;
  discount_amount: number;
  discount_type: string | null;
  discount_by: string | null;
  discount_percentage: number;
  tax_amount: number;
  tax_percentage: number;
  tax_status: "excluded" | "included";
  variation: string | null;
  description: string | null;
}

// GET /api/v1/service/booking/track — same response shape as
// /api/v1/service/booking/details/{id} (customer view, `otp` included).
export interface ServiceBookingTrackResponse {
  id: number;
  display_id: string;
  booking_type: string;
  multi_booking_type: string | null;
  parent_booking_id: number | null;
  is_repeat_parent: boolean;
  child_bookings_count: number;
  is_custom: boolean;
  booking_status: string;
  status_label: string;
  status_history: Record<string, string>;
  payment_status: string;
  payment_method: string;
  transaction_reference: string | null;
  scheduled: number;
  schedule_at: string;
  quantity: number;
  otp: number | null;
  booking_note: string | null;
  bring_change_amount: number;
  attachments: string[];
  completion_evidence: string[];
  cancellation_reason: string | null;
  canceled_by: string | null;
  service_location: {
    address: string;
    lat: string;
    lng: string;
  };
  amount: ServiceBookingTrackAmount;
  coupon_code: string | null;
  is_reviewed: boolean;
  currency_symbol: string;
  provider: ServiceBookingTrackProvider;
  customer: ServiceBookingTrackCustomer;
  servicemen: ServiceBookingTrackServiceman[];
  details: ServiceBookingTrackDetail[];
  offline_payment: unknown;
  partial_payments: unknown[];
  created_at: string;
  updated_at: string;
}

interface ServiceBookingTrackParams {
  bookingId: number | string;
  contactNumber?: string;
}

// `contact_number` is required for guests and optional for an authenticated
// customer (ownership is then proven by the bearer token's user_id instead).
const getData = async ({
  bookingId,
  contactNumber,
}: ServiceBookingTrackParams): Promise<ServiceBookingTrackResponse> => {
  const params: { booking_id: string; contact_number?: string } = {
    booking_id: String(bookingId),
  };
  if (contactNumber) params.contact_number = contactNumber;

  const { data } = await MainApi.get(service_booking_track_api, { params });
  return data;
};

export default function useGetServiceBookingTrack(
  params: ServiceBookingTrackParams,
  enabled = false
): UseQueryResult<ServiceBookingTrackResponse> {
  return useQuery<ServiceBookingTrackResponse>(
    ["service-booking-track", params?.bookingId, params?.contactNumber],
    () => getData(params),
    {
      enabled: enabled && !!params?.bookingId,
      retry: 1,
      cacheTime: 50000,
      refetchOnWindowFocus: false,
      onError: onSingleErrorResponse,
    }
  );
}
