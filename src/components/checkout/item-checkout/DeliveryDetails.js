import React from "react";

import { useTranslation } from "react-i18next";

import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import DeliveryAddress from "../delivery-address";
import { Stack } from "@mui/system";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Typography,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import RestaurantScheduleTime from "./RestaurantScheduleTime";

import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { getToken } from "helper-functions/getToken";
import LockIcon from "@mui/icons-material/Lock";
import InstantDelivery from "./InstantDelivery";
import DeliverySpeedOptions from "./DeliverySpeedOptions";

const DeliveryDetails = (props) => {
  const {
    storeData,
    setOrderType,
    orderType,
    setAddress,
    address,
    configData,
    forprescription,
    setDeliveryTip,
    customDispatch,
    scheduleTime,
    setDayNumber,
    handleChange,
    today,
    tomorrow,
    numberOfDay,
    setScheduleAt,
    formik,
    confirmPasswordHandler,
    passwordHandler,
    check,
    setCheck,
    isHomeDelivery,
    page,
    zoneData,
    deliveryFee,
    couponDiscount,
    selectedDeliveryOption,
    setSelectedDeliveryOption,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery("(max-width:490px)");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setOrderType("schedule_order");
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const handleOrderType = (value) => {
    if (value === "take_away") {
      setDeliveryTip(0);
    }
    setOrderType(value);
  };
  const handleCheckbox = (e) => {
    setCheck(e.target.checked);
  };
  const orderTypeOptions = [
    isHomeDelivery && {
      value: "delivery",
      label: t("Home Delivery"),
      onClick: () => handleOrderType("delivery"),
    },
    !forprescription &&
      configData?.takeaway_status === 1 &&
      storeData?.take_away && {
        value: "take_away",
        label: t("Take Away"),
        onClick: () => handleOrderType("take_away"),
      },
    !forprescription &&
      storeData?.schedule_order &&
      getToken() && {
        value: "schedule_order",
        label: t("Schedule Delivery"),
        onClick: handleClick,
      },
  ].filter(Boolean);

  const pillButtonSx = (selected) => ({
    flex: { xs: 1, md: "none" },
    minWidth: { xs: 0, md: 140 },
    px: { xs: 0.75, md: 3 },
    py: { xs: 0.75, md: 1 },
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: selected ? 600 : 500,
    fontSize: { xs: "12px", md: "14px" },
    boxShadow: "none",
    backgroundColor: selected ? theme.palette.primary.main : "transparent",
    color: selected
      ? theme.palette.whiteContainer.main
      : theme.palette.neutral[700],
    "&:hover": {
      backgroundColor: selected
        ? theme.palette.primary.dark
        : alpha(theme.palette.primary.main, 0.08),
      boxShadow: "none",
    },
  });

  return (
    <CustomStackFullWidth spacing={{ xs: 1.5, md: 3 }}>
      {storeData && orderTypeOptions.length > 0 && (
        <Box
          sx={{
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            borderRadius: { xs: "10px", md: "14px" },
            boxShadow: `0 1px 4px ${alpha("#000", 0.06)}`,
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 2 },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            gap={{ xs: 1.5, sm: 2 }}
            width="100%"
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "14px", md: "16px" },
                color: theme.palette.text.primary,
                whiteSpace: "nowrap",
              }}
            >
              {t("Choose Order Type")}
            </Typography>
            <Stack
              direction="row"
              gap={{ xs: 0.5, md: 1 }}
              flexWrap="nowrap"
              width={{ xs: "100%", sm: "auto" }}
              justifyContent={{ xs: "stretch", sm: "flex-end" }}
            >
              {orderTypeOptions.map((option) => {
                const selected = orderType === option.value;
                return (
                  <Button
                    key={option.value}
                    onClick={option.onClick}
                    variant={selected ? "contained" : "text"}
                    disableElevation
                    sx={pillButtonSx(selected)}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </Stack>
          </Stack>
        </Box>
      )}
      {orderType === "schedule_order" && (
				<RestaurantScheduleTime
					storeData={storeData}
					handleChange={handleChange}
					today={today}
					tomorrow={tomorrow}
					numberOfDay={numberOfDay}
					configData={configData}
					setScheduleAt={setScheduleAt}
				/>
			)}
      <DeliverySpeedOptions
        storeData={storeData}
        zoneData={zoneData}
        orderType={orderType}
        deliveryFee={deliveryFee}
        couponDiscount={couponDiscount}
        selectedDeliveryOption={selectedDeliveryOption}
        setSelectedDeliveryOption={setSelectedDeliveryOption}
      />

      <DeliveryAddress
        setAddress={setAddress}
        address={address}
        configData={configData}
        storeZoneId={storeData?.zone_id}
        orderType={orderType}
        formik={formik}
        passwordHandler={passwordHandler}
        confirmPasswordHandler={confirmPasswordHandler}
        check={check}
        setCheck={setCheck}
      />
    </CustomStackFullWidth>
  );
};

DeliveryDetails.propTypes = {};

export default DeliveryDetails;
