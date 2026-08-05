import dayjs from "dayjs";

// Day-of-week mapping — matches backend DB convention.
// JavaScript dayjs().day() uses the same 0–6 mapping so no conversion needed.
export const DAY_OF_WEEK = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

/**
 * Check if a dayjs datetime falls within any of the provider's schedule slots.
 * dayjs().day() returns 0=Sunday…6=Saturday — identical to the DB day convention.
 *
 * @param {import("dayjs").Dayjs} dt
 * @param {Array} schedules - provider.schedules array
 * @returns {{ available: boolean, reason: "no_schedule"|"closed_day"|"closed_time"|"ok" }}
 */
export function checkSchedule(dt, schedules) {
  if (!schedules || schedules.length === 0) {
    return { available: false, reason: "no_schedule" };
  }
  const dayOfWeek = dt.day(); // 0=Sunday, 6=Saturday
  const daySlots = schedules.filter((s) => s.day === dayOfWeek);
  if (daySlots.length === 0) {
    return { available: false, reason: "closed_day" };
  }
  const timeStr = dt.format("HH:mm:ss");
  const inSlot = daySlots.some(
    (s) => timeStr >= s.opening_time && timeStr <= s.closing_time,
  );
  return inSlot
    ? { available: true, reason: "ok" }
    : { available: false, reason: "closed_time" };
}

/**
 * Returns the i18n translation key for a schedule validation reason.
 * @param {"no_schedule"|"closed_day"|"closed_time"} reason
 * @returns {string}
 */
export function getScheduleErrorMessage(reason) {
  const map = {
    no_schedule: "This provider has no available schedule",
    closed_day: "Provider is not available on the selected day",
    closed_time: "The selected time is outside provider working hours",
  };
  return map[reason] ?? "Provider is not available at the selected time";
}

const LEAD_TIME_UNIT_TO_DAYJS = {
  min: "minute",
  mins: "minute",
  minute: "minute",
  minutes: "minute",
  hour: "hour",
  hours: "hour",
  day: "day",
  days: "day",
};

const LEAD_TIME_UNIT_LABEL = {
  min: "minutes",
  mins: "minutes",
  minute: "minutes",
  minutes: "minutes",
  hour: "hours",
  hours: "hours",
  day: "days",
  days: "days",
};

/**
 * Earliest moment a schedule booking may be placed for, derived from
 * configData.service_module's schedule_time_restriction_* fields.
 * Returns null when the restriction is off/unconfigured (no lower bound).
 *
 * @param {object} serviceModuleConfig - configData?.service_module
 * @returns {import("dayjs").Dayjs|null}
 */
export function getMinScheduleTime(serviceModuleConfig) {
  const {
    schedule_time_restriction_status,
    schedule_time_restriction_value,
    schedule_time_restriction_unit,
  } = serviceModuleConfig ?? {};

  if (!schedule_time_restriction_status) return null;
  const value = Number(schedule_time_restriction_value);
  if (!value || value <= 0) return null;

  const unit =
    LEAD_TIME_UNIT_TO_DAYJS[String(schedule_time_restriction_unit).toLowerCase()] ??
    "minute";
  return dayjs().add(value, unit);
}

/**
 * Check a chosen schedule datetime against the minimum allowed lead time.
 * @param {import("dayjs").Dayjs} dt
 * @param {object} serviceModuleConfig - configData?.service_module
 * @returns {{ available: boolean, reason: "ok"|"min_lead_time" }}
 */
export function checkMinLeadTime(dt, serviceModuleConfig) {
  const minTime = getMinScheduleTime(serviceModuleConfig);
  if (!minTime) return { available: true, reason: "ok" };
  return dayjs(dt).isBefore(minTime)
    ? { available: false, reason: "min_lead_time" }
    : { available: true, reason: "ok" };
}

/**
 * Human-readable lead-time restriction message, e.g.
 * "Please select a time at least 10 minutes from now".
 * @param {object} serviceModuleConfig - configData?.service_module
 * @returns {string}
 */
export function getMinLeadTimeErrorMessage(serviceModuleConfig) {
  const { schedule_time_restriction_value, schedule_time_restriction_unit } =
    serviceModuleConfig ?? {};
  const unitLabel =
    LEAD_TIME_UNIT_LABEL[String(schedule_time_restriction_unit).toLowerCase()] ??
    "minutes";
  return `Please select a time at least ${schedule_time_restriction_value} ${unitLabel} from now`;
}

/**
 * Validate an array of repeat-booking dates against provider schedules.
 * @param {Array<{date: string}>} dates - date strings in "YYYY-MM-DD HH:mm:ss"
 * @param {Array} schedules - provider.schedules
 * @returns {{ valid: boolean, firstInvalidIndex: number, reason: string }}
 */
export function validateRepeatDates(dates, schedules) {
  if (!schedules || schedules.length === 0) {
    return { valid: false, firstInvalidIndex: 0, reason: "no_schedule" };
  }
  for (let i = 0; i < dates.length; i++) {
    const dt = dayjs(dates[i].date, "YYYY-MM-DD HH:mm:ss");
    const result = checkSchedule(dt, schedules);
    if (!result.available) {
      return { valid: false, firstInvalidIndex: i, reason: result.reason };
    }
  }
  return { valid: true, firstInvalidIndex: -1, reason: "ok" };
}
