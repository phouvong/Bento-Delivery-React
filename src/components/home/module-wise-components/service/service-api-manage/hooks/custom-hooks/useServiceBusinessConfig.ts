import { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  checkMinLeadTime,
  getMinLeadTimeErrorMessage,
  getMinScheduleTime,
} from "components/home/module-wise-components/service/utils/providerScheduleValidation";

interface ServiceModuleApprovalCriteria {
  add_new_service?: boolean;
  update_service_price?: boolean;
  update_service_variation?: boolean;
  update_anything_in_service_details?: boolean;
}

interface ServiceModuleConfig {
  // instant_booking / repeat_booking / schedule_booking are admin-wide
  // toggles here, but booking availability is decided per-provider — see
  // ProviderBookingConfig / providerData below, which this hook keeps as
  // the source of truth for those three.
  instant_booking?: boolean;
  repeat_booking?: boolean;
  rebooking_option?: boolean;
  schedule_booking?: boolean;
  schedule_time_restriction_status?: boolean;
  schedule_time_restriction_value?: number | string;
  schedule_time_restriction_unit?: string;
  bidding_system?: boolean;
  see_other_providers_offers?: boolean;
  post_validation_days?: number | string;
  otp_for_complete_service?: boolean;
  complete_photo_evidence?: boolean;
  provider_can_cancel_booking?: boolean;
  provider_can_edit_booking?: boolean;
  provider_can_reply_review?: boolean;
  provider_category_status?: boolean;
  provider_self_registration?: boolean;
  review_section?: boolean;
  provider_verified_badge?: boolean;
  at_provider_place?: boolean;
  service_gallery?: boolean;
  access_all_services?: boolean;
  serviceman_cancel_booking_req?: boolean;
  approval?: boolean;
  approval_criteria?: ServiceModuleApprovalCriteria;
}

interface ProviderBookingConfig {
  instant_booking?: boolean;
  repeat_booking?: boolean;
  schedule_booking?: boolean;
  // Explicit per-location availability flags from the provider payload.
  service_location_customer_status?: boolean;
  service_location_provider_status?: boolean;
  // Some responses carry the location list at the top level too.
  choose_service_location?: string[];
  store_config?: {
    choose_service_location?: string[];
  };
}

type ServiceLocationAvailability = "both" | "customer" | "provider" | "none";

// Fallback lead time used when instant booking is off but no explicit
// schedule_time_restriction is configured — still can't book for "right now".
const FALLBACK_LEAD_MINUTES = 30;

interface ServiceBusinessConfig {
  instantBookingEnabled: boolean;
  repeatBookingEnabled: boolean;
  // Whether the Single Booking tab has any way to complete a one-time
  // booking at all — instantly, or (when instant is off) via mandatory scheduling.
  singleBookingAvailable: boolean;
  // schedule_booking only governs "may the user ALSO pick a later time in
  // addition to instant" — irrelevant once instant itself is off, since then
  // scheduling is the only path and is implicitly required.
  canSchedule: boolean;
  mustSchedule: boolean;
  leadTimeRestrictionEnabled: boolean;
  leadTimeValue: number | string | null;
  leadTimeUnit: string | null;
  getMinScheduleTime: () => Dayjs | null;
  checkLeadTime: (dt: Dayjs | Date) => {
    available: boolean;
    reason: "ok" | "min_lead_time";
  };
  getLeadTimeErrorMessage: () => string;
  // Earliest moment to pre-fill when instant isn't an option: the configured
  // restriction time if one applies, else the 30-minute fallback.
  getDefaultScheduleTime: () => Dayjs | null;
  biddingSystemEnabled: boolean;
  postValidationDays: number | null;
  otpForCompleteServiceEnabled: boolean;
  // A custom-service request expires post_validation_days (× 24h) after its
  // created_at. Always false when post_validation_days isn't configured.
  isPostExpired: (createdAt: string | Date | Dayjs | null | undefined) => boolean;
  canChooseCustomerLocation: boolean;
  canChooseProviderLocation: boolean;
  canChangeServiceLocation: boolean;
  serviceLocationAvailability: ServiceLocationAvailability;
  rebookingEnabled: boolean;
  seeOtherProvidersOffersEnabled: boolean;
  completePhotoEvidenceEnabled: boolean;
  providerCanCancelBooking: boolean;
  providerCanEditBooking: boolean;
  providerCanReplyReview: boolean;
  providerCategoryEnabled: boolean;
  providerSelfRegistrationEnabled: boolean;
  reviewSectionEnabled: boolean;
  providerVerifiedBadgeEnabled: boolean;
  atProviderPlaceEnabled: boolean;
  serviceGalleryEnabled: boolean;
  accessAllServicesEnabled: boolean;
  servicemanCancelBookingReqEnabled: boolean;
  providerApprovalRequired: boolean;
  approvalCriteria: {
    addNewService: boolean;
    updateServicePrice: boolean;
    updateServiceVariation: boolean;
    updateAnythingInServiceDetails: boolean;
  };
}

export default function useServiceBusinessConfig(
  configData: { service_module?: ServiceModuleConfig } | null | undefined,
  providerData?: ProviderBookingConfig | null,
): ServiceBusinessConfig {
  const serviceModuleConfig = configData?.service_module;

  return useMemo(() => {
    const instantBookingEnabled = providerData
      ? Boolean(providerData.instant_booking)
      : true;
    const repeatBookingEnabled = providerData
      ? Boolean(providerData.repeat_booking)
      : true;
    const canSchedule = Boolean(providerData?.schedule_booking);
    const mustSchedule = !instantBookingEnabled;
    const singleBookingAvailable = instantBookingEnabled || canSchedule;
    // If instant is off, scheduling is mandatory regardless of schedule_booking —
    // that flag only matters as an *optional* add-on when instant is available.
    const schedulingAllowed = mustSchedule || canSchedule;
    const leadTimeRestrictionEnabled =
      schedulingAllowed &&
      Boolean(serviceModuleConfig?.schedule_time_restriction_status);
    const postValidationDays =
      serviceModuleConfig?.post_validation_days != null
        ? Number(serviceModuleConfig.post_validation_days)
        : null;
    const chooseServiceLocation =
      providerData?.store_config?.choose_service_location ??
      providerData?.choose_service_location ??
      [];
    // Prefer the explicit status flags (service_location_*_status) when the
    // payload provides them; fall back to the choose_service_location list.
    const canChooseCustomerLocation =
      typeof providerData?.service_location_customer_status === "boolean"
        ? providerData.service_location_customer_status
        : chooseServiceLocation.includes("customer");
    const canChooseProviderLocation =
      typeof providerData?.service_location_provider_status === "boolean"
        ? providerData.service_location_provider_status
        : chooseServiceLocation.includes("provider");
    const canChangeServiceLocation =
      canChooseCustomerLocation && canChooseProviderLocation;
    const serviceLocationAvailability: ServiceLocationAvailability =
      canChooseCustomerLocation && canChooseProviderLocation
        ? "both"
        : canChooseCustomerLocation
        ? "customer"
        : canChooseProviderLocation
        ? "provider"
        : "none";

    return {
      instantBookingEnabled,
      repeatBookingEnabled,
      singleBookingAvailable,
      canSchedule,
      mustSchedule,
      leadTimeRestrictionEnabled,
      leadTimeValue:
        serviceModuleConfig?.schedule_time_restriction_value ?? null,
      leadTimeUnit: serviceModuleConfig?.schedule_time_restriction_unit ?? null,
      getMinScheduleTime: () =>
        leadTimeRestrictionEnabled
          ? getMinScheduleTime(serviceModuleConfig)
          : null,
      checkLeadTime: (dt) =>
        leadTimeRestrictionEnabled
          ? checkMinLeadTime(dayjs(dt), serviceModuleConfig)
          : { available: true, reason: "ok" },
      getLeadTimeErrorMessage: () =>
        getMinLeadTimeErrorMessage(serviceModuleConfig),
      getDefaultScheduleTime: () => {
        if (!mustSchedule) return null;
        if (leadTimeRestrictionEnabled)
          return getMinScheduleTime(serviceModuleConfig);
        return dayjs().add(FALLBACK_LEAD_MINUTES, "minute");
      },
      biddingSystemEnabled: Boolean(serviceModuleConfig?.bidding_system),
      postValidationDays,
      otpForCompleteServiceEnabled: Boolean(
        serviceModuleConfig?.otp_for_complete_service,
      ),
      isPostExpired: (createdAt) => {
        if (!createdAt || postValidationDays == null) return false;
        return dayjs(createdAt)
          .add(postValidationDays * 24, "hour")
          .isBefore(dayjs());
      },
      canChooseCustomerLocation,
      canChooseProviderLocation,
      canChangeServiceLocation,
      serviceLocationAvailability,
      rebookingEnabled: Boolean(serviceModuleConfig?.rebooking_option),
      seeOtherProvidersOffersEnabled: Boolean(
        serviceModuleConfig?.see_other_providers_offers,
      ),
      completePhotoEvidenceEnabled: Boolean(
        serviceModuleConfig?.complete_photo_evidence,
      ),
      providerCanCancelBooking: Boolean(
        serviceModuleConfig?.provider_can_cancel_booking,
      ),
      providerCanEditBooking: Boolean(
        serviceModuleConfig?.provider_can_edit_booking,
      ),
      providerCanReplyReview: Boolean(
        serviceModuleConfig?.provider_can_reply_review,
      ),
      providerCategoryEnabled: Boolean(
        serviceModuleConfig?.provider_category_status,
      ),
      providerSelfRegistrationEnabled: Boolean(
        serviceModuleConfig?.provider_self_registration,
      ),
      reviewSectionEnabled: Boolean(serviceModuleConfig?.review_section),
      providerVerifiedBadgeEnabled: Boolean(
        serviceModuleConfig?.provider_verified_badge,
      ),
      atProviderPlaceEnabled: Boolean(serviceModuleConfig?.at_provider_place),
      serviceGalleryEnabled: Boolean(serviceModuleConfig?.service_gallery),
      accessAllServicesEnabled: Boolean(
        serviceModuleConfig?.access_all_services,
      ),
      servicemanCancelBookingReqEnabled: Boolean(
        serviceModuleConfig?.serviceman_cancel_booking_req,
      ),
      providerApprovalRequired: Boolean(serviceModuleConfig?.approval),
      approvalCriteria: {
        addNewService: Boolean(
          serviceModuleConfig?.approval_criteria?.add_new_service,
        ),
        updateServicePrice: Boolean(
          serviceModuleConfig?.approval_criteria?.update_service_price,
        ),
        updateServiceVariation: Boolean(
          serviceModuleConfig?.approval_criteria?.update_service_variation,
        ),
        updateAnythingInServiceDetails: Boolean(
          serviceModuleConfig?.approval_criteria
            ?.update_anything_in_service_details,
        ),
      },
    };
  }, [serviceModuleConfig, providerData]);
}
