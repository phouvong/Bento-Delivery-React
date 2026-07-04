import React, { useEffect, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { Grid, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../custom-component/CustomPhoneInput";
import { useFormik } from "formik";
import { setGuestUserInfo } from "redux/slices/guestUserInfo";
import { getLanguage, getModule } from "helper-functions/getLanguage";
import { PrimaryButton } from "../Map/map.style";
import TrackOrderDetails from "./TrackOrderDetails";
import { getGuestId } from "helper-functions/getToken";
import useGetTrackOrderData from "../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import { useDispatch, useSelector } from "react-redux";

import Router from "next/router";
import { useGetTripDetails } from "api-manage/hooks/react-query/useGetTripDetails";

const TrackOrderInput = ({ configData, pt = "62px" }) => {
  const dispatch = useDispatch();
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [didSearchTrip, setDidSearchTrip] = useState(false);
  const { selectedModule } = useSelector((state) => state.utilsData);

  const trackOrderFormik = useFormik({
    initialValues: {
      order_id: "",
      contact_person_number: "",
    },
    onSubmit: async (values, helpers) => {
      try {
        dispatch(setGuestUserInfo(values));
        setShowOrderDetails(true);
        if (getModule()?.module_type === "rental") {
          setDidSearchTrip(true);
          refetchData();
        } else {
          refetchTrackOrder();
        }
      } catch (err) {}
    },
  });
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const nameHandler = (value) => {
    trackOrderFormik.setFieldValue("order_id", value);
  };
  const numberHandler = (value) => {
    trackOrderFormik.setFieldValue("contact_person_number", `+${value}`);
  };
  const guestId = getGuestId();
  const handleSuccess = () => {
    setShowOrderDetails(true);
  };
  const {
    refetch: refetchTrackOrder,
    data: trackOrderData,
    isLoading,
  } = useGetTrackOrderData(
    trackOrderFormik?.values?.order_id,
    trackOrderFormik?.values?.contact_person_number,
    guestId,
    setShowOrderDetails,
    handleSuccess,
  );
  const {
    data: tripDetails,
    refetch: refetchData,
    isFetching,
  } = useGetTripDetails(trackOrderFormik?.values?.order_id);
  useEffect(() => {
    if (didSearchTrip && tripDetails) {
      Router.push(`/rental/trip-status/${tripDetails?.id}?from=""`);
    }
  }, [tripDetails, didSearchTrip]);

  return (
    <CustomStackFullWidth pt={pt} spacing={2}>
      <Stack
        spacing={3}
        alignItems="center"
        sx={{
          width: "100%",
          backgroundColor: "background.paper",
          borderRadius: "12px",
          boxShadow: (theme) => theme.shadows[1],
          py: { xs: 3, md: 6 },
          px: { xs: 2, md: 8 },
        }}
      >
        {/* Title */}
        <Stack spacing={1} alignItems="center">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "24px", md: "32px" },
              lineHeight: 1.1,
              letterSpacing: "-0.64px",
              color: "neutral.1050",
              textAlign: "center",
            }}
          >
            {selectedModule?.module_type === "rental"
              ? t("Track Your Trip")
              : t("Track Your Order")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.3,
              letterSpacing: "-0.48px",
              color: "neutral.500",
              textAlign: "center",
            }}
          >
            {selectedModule?.module_type === "rental"
              ? t("Enter your trip ID and phone number to get live updates")
              : t("Enter your order ID and phone number to get live updates")}
          </Typography>
        </Stack>

        {/* Form */}
        <form
          noValidate
          onSubmit={trackOrderFormik.handleSubmit}
          style={{ width: "100%" }}
        >
          <Grid container spacing={2} paddingX={{ xs: ".5rem", md: "2rem" }}>
            <Grid item xs={12} md={5}>
              <CustomTextFieldWithFormik
                placeholder={
                  selectedModule?.module_type === "rental"
                    ? t("Enter your trip id")
                    : t("Enter your order id")
                }
                required="true"
                type="text"
                label={
                  selectedModule?.module_type === "rental"
                    ? t("Trip Id")
                    : t("Order Id")
                }
                touched={trackOrderFormik.touched.order_id}
                errors={trackOrderFormik.errors.order_id}
                fieldProps={trackOrderFormik.getFieldProps("order_id")}
                onChangeHandler={nameHandler}
                value={trackOrderFormik.values.order_id}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomPhoneInput
                value={trackOrderFormik.values.contact_person_number}
                onHandleChange={numberHandler}
                initCountry={configData?.country}
                touched={trackOrderFormik.touched.contact_person_number}
                errors={trackOrderFormik.errors.contact_person_number}
                rtlChange="true"
                lanDirection={lanDirection}
                height="45px"
                borderRadius="8px"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <PrimaryButton type="submit">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  gap="6px"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  <i
                    className="fi fi-rr-search"
                    style={{ fontSize: 15, lineHeight: 1, display: "flex" }}
                  />
                  {selectedModule?.module_type === "rental"
                    ? t("Search Trip")
                    : t("Search Order")}
                </Stack>
              </PrimaryButton>
            </Grid>
          </Grid>
        </form>

        {/* Results */}
        {trackOrderData && showOrderDetails && (
          <TrackOrderDetails
            trackOrderFormik={trackOrderFormik}
            showOrderDetails={setShowOrderDetails}
            trackOrderData={trackOrderData}
          />
        )}
      </Stack>
    </CustomStackFullWidth>
  );
};

export default TrackOrderInput;
