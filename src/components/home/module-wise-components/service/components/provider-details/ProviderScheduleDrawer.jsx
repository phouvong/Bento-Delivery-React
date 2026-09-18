import CloseIcon from "@mui/icons-material/Close";
import {
  Drawer,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import CustomDivider from "components/CustomDivider";

const DAY_ORDER = [0, 1, 2, 3, 4, 5, 6];

const formatTime = (time) =>
  time ? moment(time, "HH:mm:ss").format("hh:mm A") : "";

const groupSchedulesByDay = (schedules) => {
  const map = {};
  (schedules ?? []).forEach((item) => {
    if (item?.day == null) return;
    if (!map[item.day]) map[item.day] = [];
    map[item.day].push(item);
  });
  return map;
};

const ProviderScheduleDrawer = ({ open, onClose, schedules }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const schedulesByDay = groupSchedulesByDay(schedules);
  const today = moment().day();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 50,
        "& .MuiDrawer-paper": {
          width: { xs: "300px", sm: "380px", md: "420px" },
          padding: "20px",
          boxSizing: "border-box",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginBottom: "10px" }}
      >
        <Typography fontSize="16px" fontWeight="700">
          {t("Service Time")}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            backgroundColor: theme.palette.neutral[200],
            borderRadius: "50%",
            padding: "5px",
            "&:hover": {
              backgroundColor: theme.palette.neutral[300],
            },
          }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
      </Stack>
      <CustomDivider border="1px" />

      <Stack spacing={1} sx={{ mt: 2 }}>
        {DAY_ORDER.map((day) => {
          const daySchedules = schedulesByDay[day] ?? [];
          const isToday = day === today;
          return (
            <Stack
              key={day}
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: "10px",
                backgroundColor: isToday
                  ? alpha(theme.palette.primary.main, 0.08)
                  : "transparent",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: isToday ? 700 : 500,
                    color: isToday
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                >
                  {moment().day(day).format("dddd")}
                </Typography>
                {isToday && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "10px",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: theme.palette.whiteContainer.main,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "999px",
                      px: 0.75,
                      py: "3px",
                    }}
                  >
                    {t("Today")}
                  </Typography>
                )}
              </Stack>

              {daySchedules.length > 0 ? (
                <Stack spacing={0.5} alignItems="flex-end">
                  {daySchedules.map((slot) => (
                    <Typography
                      key={slot.id}
                      sx={{
                        fontSize: "13px",
                        fontWeight: isToday ? 600 : 400,
                        color: isToday
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                      }}
                    >
                      {formatTime(slot.opening_time)} –{" "}
                      {formatTime(slot.closing_time)}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.error.main,
                  }}
                >
                  {t("Closed")}
                </Typography>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Drawer>
  );
};

export default ProviderScheduleDrawer;
