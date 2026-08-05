import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import SelectDateTimeModal from "components/home/module-wise-components/service/components/common/SelectDateTimeModal";
import useServiceBusinessConfig from "components/home/module-wise-components/service/service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import {
  checkSchedule,
  getScheduleErrorMessage,
} from "components/home/module-wise-components/service/utils/providerScheduleValidation";
import InstantService from "./InstantService";
import ScheduleService from "./ScheduleService";

const toScheduledAt = (dt) => ({
  timestamp: dt.toDate(),
  date: dt.format("YYYY-MM-DD"),
  time: dt.format("hh:mm A"),
});

export default function SingleBooking({ configData, address, setAddress, isCustomService, scheduledAt, setScheduledAt, providerData }) {
  const { t } = useTranslation();
  const [openPicker, setOpenPicker] = useState(false);
  const {
    mustSchedule,
    canSchedule,
    checkLeadTime,
    getLeadTimeErrorMessage,
    getDefaultScheduleTime,
  } = useServiceBusinessConfig(configData, providerData);
  // Instant is off — a real schedule time is mandatory, never optional.
  const canEditSchedule = mustSchedule || canSchedule;

  // Instant service isn't offered: pre-fill the earliest bookable time
  // (the configured lead-time restriction, or a 30-min fallback) instead of
  // leaving the field on "Instant Service".
  useEffect(() => {
    if (!mustSchedule || scheduledAt) return;
    const defaultTime = getDefaultScheduleTime();
    if (defaultTime) setScheduledAt(toScheduledAt(defaultTime));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mustSchedule, scheduledAt]);

  const handleConfirm = (result) => {
    if (!result && mustSchedule) {
      // Instant ("now") isn't a valid choice when scheduling is mandatory.
      toast.error(t("Instant service is not available. Please select a future time"), {
        id: "schedule-lead-time",
      });
      return;
    }

    // result === null means instant service (current moment)
    const dtToCheck = result ? result.timestamp : dayjs();
    const schedules = providerData?.schedules;

    if (schedules !== undefined && schedules !== null) {
      const check = checkSchedule(dtToCheck, schedules);
      if (!check.available) {
        toast.error(t(getScheduleErrorMessage(check.reason)), { id: "provider-not-available" });
        setOpenPicker(false);
        return;
      }
    }

    // Lead-time restriction only applies to an actual later-scheduled time, not "now".
    if (result) {
      const leadCheck = checkLeadTime(dtToCheck);
      if (!leadCheck.available) {
        toast.error(t(getLeadTimeErrorMessage()), { id: "schedule-lead-time" });
        setOpenPicker(false);
        return;
      }
    }

    setScheduledAt(result);
    setOpenPicker(false);
  };

  return (
    <>
      <Stack spacing={{ xs: 2, md: 3 }}>
        {mustSchedule || scheduledAt ? (
          <ScheduleService
            isCustomService={isCustomService}
            scheduledAt={scheduledAt}
            onEdit={canEditSchedule ? () => setOpenPicker(true) : undefined}
          />
        ) : (
          <InstantService onEdit={canEditSchedule ? () => setOpenPicker(true) : undefined} />
        )}
      </Stack>

      <SelectDateTimeModal
        open={openPicker}
        onClose={() => setOpenPicker(false)}
        onConfirm={handleConfirm}
        value={scheduledAt}
      />
    </>
  );
}
