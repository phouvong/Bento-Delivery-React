import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { alpha } from "@mui/system";

const BasicDateTimePicker = ({ value, handleDateChange, height, sx }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        value={dayjs(value)}
        minDateTime={dayjs().subtract(10, "minute")}
        className="custom-date-picker"
        sx={{
          "& .MuiInputBase-root": {
            height: height || "auto",
          },
          "& .MuiSvgIcon-root": {
            color: (theme) =>
              alpha(theme.palette.neutral[400], 0.5),
          },
          ...sx,
        }}
        timeSteps={{ minutes: 1 }}
        onChange={handleDateChange}
        slotProps={{
          desktopPaper: {
            sx: {
              maxHeight: "45vh",
              overflowY: "auto",
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default BasicDateTimePicker;
