import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {t} from "i18next";
import {LoadingButton} from "@mui/lab";

const ChangeTripHours = ({
                           rentalSearch,
                           setOpenHourDiffModal,
                           confirmIsLoading,
                           handleHourDiffModal,
                           bookingDetails,
                           updateOrAdd
                         }) => {
  return (
    <Stack spacing={2} p="1rem">
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <InfoIcon sx={{ fontSize: "70px" }} />
      </Stack>
      <Typography textAlign="center"  fontSize="18px" fontWeight="600" color={theme=>theme.palette.error.main}>
        {t(`Do you want to change trip duration`)}
      </Typography>
      <Typography textAlign="center"  fontSize="16px" fontWeight="400">
        {t(`Are you sure, you want to update trip duration to ${rentalSearch?.duration} hours`)}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button fullWidth  variant="outlined" onClick={()=>{setOpenHourDiffModal(false)}}>
          {t("No")}
        </Button>
        <LoadingButton loading={confirmIsLoading} fullWidth variant="contained" onClick={()=>{handleHourDiffModal(bookingDetails,updateOrAdd)}}>
          {t("Yes")}
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default ChangeTripHours;