import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Button, Stack, Typography } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CustomDateTimePicker = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Date Selection */}
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
          sx={{
            width: "100%",

            "& .MuiInputBase-root": {
              height: "45px",
            },
            "& .MuiOutlinedInput-input": {
              padding: "10px 14px",
            },
          }}
        />

        {/* Time Selection */}
        {/*<TimePicker*/}
        {/*  label="Select Time"*/}
        {/*  value={selectedTime}*/}
        {/*  onChange={handleTimeChange}*/}
        {/*  sx={{*/}
        {/*    width: "100%",*/}
        {/*    "& .MuiInputBase-root": {*/}
        {/*      height: "45px",*/}
        {/*    },*/}
        {/*    "& .MuiOutlinedInput-input": {*/}
        {/*      padding: "10px 14px",*/}
        {/*    },*/}
        {/*  }}*/}
        {/*/>*/}
      </Box>
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;
