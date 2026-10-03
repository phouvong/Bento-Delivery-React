import React from "react";

import moment from "moment";
import { isAvailable } from "../../utils/CustomFunctions";
import ClosedNowOverlay from "./ClosedNowOverlay";

/**
 * Decides whether to draw the "Closed now" overlay.
 *
 * `schedules` used to arrive on the store/provider detail payload, but the v4.2
 * API no longer returns it on any endpoint. Reading `.length` off it threw, and
 * simply optional-chaining would have fallen into the `else` branch below and
 * marked every store closed — a false "Closed now" banner on trading stores.
 * So when there is no schedule to evaluate, defer to the `open` flag the API
 * does still send, and only claim "closed" when it explicitly says so.
 */
const ClosedNowScheduleWise = (props) => {
  const { active, schedules, borderRadius, open } = props;

  if (!active) {
    return <ClosedNowOverlay borderRadius={borderRadius} />;
  }

  const scheduleList = Array.isArray(schedules) ? schedules : [];

  if (scheduleList.length > 0) {
    const todayInNumber = moment().weekday();
    const isOpen = scheduleList
      .filter((item) => item?.day === todayInNumber)
      .some((item) => isAvailable(item?.opening_time, item?.closing_time));

    return isOpen ? null : <ClosedNowOverlay borderRadius={borderRadius} />;
  }

  // No schedule data — fall back to the `open` flag. `undefined` means we have
  // no signal at all, and a wrong "closed" costs an order, so stay quiet.
  if (open === 0 || open === false) {
    return <ClosedNowOverlay borderRadius={borderRadius} />;
  }
  return null;
};

ClosedNowScheduleWise.propTypes = {};

export default ClosedNowScheduleWise;
