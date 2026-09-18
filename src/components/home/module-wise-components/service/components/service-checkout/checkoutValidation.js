import dayjs from "dayjs";
import {
  checkSchedule,
  getScheduleErrorMessage,
  validateRepeatDates,
} from "components/home/module-wise-components/service/utils/providerScheduleValidation";
import { resolveContactPerson } from "./get-service-at/resolveContactPerson";

const fail = (message, toastId) => ({
  valid: false,
  message,
  toastId,
});

export const validateBookingForm = (params) => {
  const {
    isBuyNow,
    buyNowItem,
    isCampaignBuyNow,
    isCustomService,
    reqServiceDetails,
    providerId,
    address,
    providerData,
    bookingType,
    scheduledAt,
    repeatDates,
    checkLeadTime,
    getLeadTimeErrorMessage,
    token,
    guestUserInfo,
    profileInfo,
    paymentMethod,
    createAccountChecked,
    formik,
    offlineMethod,
  } = params;

  if (isBuyNow && !buyNowItem?.id) {
    return fail("Booking item not found");
  }

  // Campaign items are a one-off, time-boxed purchase — no repeat schedule.
  if (isCampaignBuyNow && bookingType === "repeat") {
    return fail(
      "Multiple booking is not available for campaign items",
      "campaign-repeat-unavailable",
    );
  }

  if (isCampaignBuyNow) {
    const campaignEnd =
      buyNowItem?.available_date_ends &&
      dayjs(
        `${buyNowItem.available_date_ends} ${
          buyNowItem?.available_time_ends || "23:59:59"
        }`,
        "YYYY-MM-DD HH:mm:ss",
      );
    const dtToCheck = scheduledAt ? dayjs(scheduledAt.timestamp) : dayjs();
    if (campaignEnd?.isValid() && dtToCheck.isAfter(campaignEnd)) {
      return fail(
        "Selected date/time is outside the campaign availability window",
        "campaign-schedule-expired",
      );
    }
  }

  if (isCustomService && !reqServiceDetails?.data?.selected_offer?.id) {
    return fail("Booking details not loaded yet");
  }

  if (!isCustomService && !providerId) {
    return fail("Provider information missing");
  }

  if (!address?.lat && !address?.latitude) {
    return fail("Please select your service location");
  }

  // Skip for custom service — provider already confirmed availability at bid time.
  if (!isCustomService && providerData) {
    const schedules = providerData.schedules;
    if (!schedules || schedules.length === 0) {
      return fail(
        "This provider has no available schedule",
        "provider-not-available",
      );
    }
    if (bookingType === "regular") {
      const dtToCheck = scheduledAt ? dayjs(scheduledAt.timestamp) : dayjs();
      const check = checkSchedule(dtToCheck, schedules);
      if (!check.available) {
        return fail(
          getScheduleErrorMessage(check.reason),
          "provider-not-available",
        );
      }

      if (scheduledAt) {
        const leadCheck = checkLeadTime(dtToCheck);
        if (!leadCheck.available) {
          return fail(getLeadTimeErrorMessage(), "schedule-lead-time");
        }
      }
    }
    if (bookingType === "repeat" && repeatDates?.length > 0) {
      const { valid, reason } = validateRepeatDates(repeatDates, schedules);
      if (!valid) {
        return fail(getScheduleErrorMessage(reason), "provider-not-available");
      }
    }
  }

  // The API rejects guest custom-service bookings with 403.
  if (isCustomService && !token) {
    return fail("Please sign in to book a custom service");
  }

  // Logged-in users default to their own account info (editable) — only
  // guests, who have no account to fall back to, are strictly required to
  // fill the form. Matches the pill shown in ContactInfoSection.
  const contactPerson = resolveContactPerson({
    address,
    guestUserInfo,
    profileInfo,
    token,
  });

  if (!contactPerson.name) {
    return fail("Please add your contact person name");
  }
  if (!contactPerson.number) {
    return fail("Please add your contact person number");
  }
  if (!contactPerson.email) {
    return fail("Please add your contact person email");
  }

  // "Create account with existing info" checked — password fields are
  // required before the booking API is called, not left for the backend
  // to reject after the fact.
  if (createAccountChecked) {
    const password = formik?.values?.password;
    const confirmPassword = formik?.values?.confirm_password;
    if (!password) {
      return fail("Password is required", "create-account-password");
    }
    if (password.length < 6) {
      return fail(
        "Password is too short - should be 6 chars minimum.",
        "create-account-password",
      );
    }
    if (password !== confirmPassword) {
      return fail("Passwords must match", "create-account-confirm-password");
    }
  }

  if (!paymentMethod && bookingType !== "repeat") {
    return fail("Please select a payment method");
  }

  if (paymentMethod === "offline_payment" && !offlineMethod?.id) {
    return fail("Please select an offline payment method");
  }

  if (bookingType === "repeat" && (!repeatDates || repeatDates.length === 0)) {
    return fail("Please select at least one booking date and arrival time");
  }

  if (bookingType === "repeat" && repeatDates.length > 0) {
    const now = dayjs();
    const hasPast = repeatDates.some((d) =>
      dayjs(d.date, "YYYY-MM-DD HH:mm:ss").isBefore(now),
    );
    if (hasPast) {
      return fail(
        "One or more booking dates are in the past. Please update your schedule.",
      );
    }
  }

  if (bookingType === "regular" && scheduledAt) {
    if (dayjs(scheduledAt.timestamp).isBefore(dayjs())) {
      return fail(
        "Scheduled time has already passed. Please select a future time.",
      );
    }
  }

  return { valid: true };
};
