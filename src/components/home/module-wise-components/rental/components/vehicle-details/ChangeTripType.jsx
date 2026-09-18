import React from 'react';
import {Button, Stack, Typography, useTheme} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {t} from "i18next";
import {LoadingButton} from "@mui/lab";

const ChangeTripType = ({
                          setIsSameOpen,
                          cartList,
                          userDataIsLoading,
                          handleChangePrvTripType,
                          updateCartObject
                        }) => {

  const theme=useTheme()
  return (
    <Stack spacing={2} p="1rem">
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <InfoIcon sx={{ fontSize: "70px" }} />
      </Stack>
      <Typography textAlign="center"  fontSize="18px" fontWeight="600" color={theme=>theme.palette.error.main}>
        {t(`Do you want to change trip type`)}
      </Typography>
      <Typography
        textAlign="center"

        fontSize="14px"
        fontWeight="400"
      >
        {t(`Are you sure you,  want to switch trip type from ${cartList?.user_data?.rental_type?.replace("_", " ")} ${cartList?.user_data?.rental_type==="hourly"?"based to":"to"} ${updateCartObject?.tripType?.replace("_", " ")} ${updateCartObject?.tripType==="hourly"?"based":""}? `)}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            setIsSameOpen(false);
          }}
        >
          {t("No")}
        </Button>
        <LoadingButton
          loading={userDataIsLoading}
          fullWidth
          variant="contained"
          onClick={handleChangePrvTripType}
        >
          {t("Yes")}
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default ChangeTripType;