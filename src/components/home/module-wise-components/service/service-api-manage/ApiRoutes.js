export const data_limit = "10";
export const search_api = "/api/v1/service/search";

export const provider_details_api = "/api/v1/stores/details";

export const service_api = "/api/v1/service";
export const popular_service_api = "/api/v1/service/popular";
export const recommended_service_api = "/api/v1/service/recommended";
export const explore_service_api = "/api/v1/service/explore";
export const quick_emergency_experts_api =
  "/api/v1/service/quick-emergency-experts";

export const related_provider_services_api =
  "/api/v1/service/related-provider-services";
export const get_service_search_page_data = "/api/v1/service/get-combined-data";

export const custom_service_list_api = "/api/v1/customer/custom-service";
// New service custom-requests endpoints (StoreCustomServiceRequestRequest).
// All three follow the REST resource pattern: /api/v1/service/custom-requests[/:id].
export const custom_service_create_api = "/api/v1/service/custom-requests";
export const custom_service_update_api = "/api/v1/service/custom-requests";
export const custom_service_delete_api = "/api/v1/service/custom-requests";

// REST resource: /api/v1/service/requested-services[/:id].
export const service_request_list_api = "/api/v1/service/requested-services";
export const service_request_create_api = "/api/v1/service/requested-services";
export const service_request_update_api = "/api/v1/service/requested-services";
export const service_request_delete_api = "/api/v1/service/requested-services";
export const service_request_cancel_api = "/api/v1/service/requested-services";

// Customer APIs
export const service_module_status_api =
  "/api/v1/service/service-module/status";
export const latest_service_api = "/api/v1/service/latest";
export const top_rated_service_api = "/api/v1/service/top-rated";
export const service_search_suggestion_api =
  "/api/v1/service/search-suggestion";
export const service_details_api = "/api/v1/service/details";
export const related_service_api = "/api/v1/service/related";
export const service_offers_items_api = "/api/v1/service/offers/items";
export const last_booking_api = "/api/v1/service/booking/last";

export const service_booking_place_api = "/api/v1/service/booking/place";

export const service_reviews_api = "/api/v1/service/reviews";
// POST — submit a review for a completed booking's service. (Confirmed contract.)
// Body: service_id, booking_id, rating (1-5), comment?, attachment[]? (jpg/jpeg/png/webp).
export const service_submit_review_api = "/api/v1/service/reviews/submit";
// POST — submit a review for a serviceman on a completed booking.
// Mirrors the main module's "/api/v1/delivery-man/reviews/submit" convention.
// NOTE: confirm exact path/payload with the service backend if reviews fail.
export const service_submit_serviceman_review_api =
  "/api/v1/service/serviceman/reviews/submit";

export const service_booking_list_api = "/api/v1/service/booking/list";
export const service_booking_details_api = "/api/v1/service/booking/details";
export const service_booking_payment_api = "/api/v1/service/booking/payment";
export const service_booking_get_tax_api = "/api/v1/service/booking/get-tax";
export const service_booking_cancel_api = "/api/v1/service/booking/cancel";
export const service_booking_log_api = "/api/v1/service/booking/log";
export const service_booking_rebook_api = "/api/v1/service/booking/rebook";
export const service_booking_invoice_api = "/api/v1/service/booking/invoice";
export const service_campaigns_api = "/api/v1/service/campaigns";
export const service_campaign_details_api = "/api/v1/service/campaigns/details";
export const service_booking_track_api = "/api/v1/service/booking/track";
