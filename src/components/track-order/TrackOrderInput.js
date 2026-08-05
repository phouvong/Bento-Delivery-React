import React, { useEffect, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import CustomPhoneInput from "../custom-component/CustomPhoneInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setGuestUserInfo } from "redux/slices/guestUserInfo";
import { getLanguage, getModule } from "helper-functions/getLanguage";
import { PrimaryButton } from "../Map/map.style";
import TrackOrderDetails from "./TrackOrderDetails";
import { getGuestId } from "helper-functions/getToken";
import useGetTrackOrderData from "../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import { useDispatch, useSelector } from "react-redux";

import Router from "next/router";
import { useGetTripDetails } from "api-manage/hooks/react-query/useGetTripDetails";
import useGetServiceBookingTrack from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useGetServiceBookingTrack";

const BOOKING_STATUS_TO_ORDER_STATUS = {
  pending: "pending",
  confirmed: "confirmed",
  ongoing: "processing",
  completed: "delivered",
};

const mapBookingToTrackOrderData = (booking) =>
  booking && {
    id: booking.id,
    order_amount: booking.amount?.booking_amount,
    order_status: BOOKING_STATUS_TO_ORDER_STATUS[booking.booking_status],
    booking_status: booking.booking_status,
    otp: booking.otp,
    module_type: "service",
    store: { name: booking.provider?.name },
    delivery_address: { address: booking.service_location?.address },
    confirmed: booking.status_history?.confirmed,
    processing: booking.status_history?.ongoing,
    delivered: booking.status_history?.completed,
  };

const TrackOrderInput = ({ configData, pt = "62px" }) => {
  const dispatch = useDispatch();
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [didSearchTrip, setDidSearchTrip] = useState(false);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const isServiceModule = selectedModule?.module_type === "service";
  const isRentalModule = selectedModule?.module_type === "rental";

  const trackOrderFormik = useFormik({
    initialValues: {
      order_id: "",
      contact_person_number: "",
    },
    validationSchema: Yup.object().shape({
      order_id: Yup.string().trim().required(t("This field is required")),
    }),
    onSubmit: async (values, helpers) => {
      try {
        dispatch(setGuestUserInfo(values));
        setShowOrderDetails(true);
        if (getModule()?.module_type === "rental") {
          setDidSearchTrip(true);
          refetchData();
        } else if (getModule()?.module_type === "service") {
          refetchServiceBookingTrack();
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

  const {
    refetch: refetchServiceBookingTrack,
    data: serviceBookingTrackData,
    isError: serviceBookingTrackIsError,
    isFetching: isServiceBookingTrackFetching,
  } = useGetServiceBookingTrack(
    {
      bookingId: trackOrderFormik?.values?.order_id,
      contactNumber: trackOrderFormik?.values?.contact_person_number,
    },
    false,
  );

  useEffect(() => {
    if (serviceBookingTrackIsError) setShowOrderDetails(false);
  }, [serviceBookingTrackIsError]);

  const isSearching = isServiceModule
    ? isServiceBookingTrackFetching
    : isRentalModule
      ? isFetching
      : isLoading;

  const resolvedTrackOrderData = isServiceModule
    ? mapBookingToTrackOrderData(serviceBookingTrackData)
    : trackOrderData;

  const trackCopy = isRentalModule
    ? {
        title: t("Track Your Trip"),
        subtitle: t("Enter your trip ID and phone number to get live updates"),
        placeholder: t("Enter your trip id"),
        label: t("Trip Id"),
        button: t("Search Trip"),
      }
    : isServiceModule
      ? {
          title: t("Track Your Booking"),
          subtitle: t(
            "Enter your booking ID and phone number to get live updates",
          ),
          placeholder: t("Enter your booking id"),
          label: t("Booking Id"),
          button: t("Search Booking"),
        }
      : {
          title: t("Track Your Order"),
          subtitle: t("Enter your order ID and phone number to get live updates"),
          placeholder: t("Enter your order id"),
          label: t("Order Id"),
          button: t("Search Order"),
        };

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
          py: { xs: 3, lg: 6 },
          px: { xs: 2, lg: 8 },
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
            {trackCopy.title}
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
            {trackCopy.subtitle}
          </Typography>
        </Stack>

        {/* Form */}
        <form
          noValidate
          onSubmit={trackOrderFormik.handleSubmit}
          style={{ width: "100%" }}
        >
          <Grid container spacing={2} paddingX={{ xs: ".5rem", md: "1rem" }}>
            <Grid item xs={12} md={5}>
              <CustomTextFieldWithFormik
                placeholder={trackCopy.placeholder}
                required="true"
                type="text"
                label={trackCopy.label}
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
              <PrimaryButton type="submit" disabled={isSearching}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  gap="6px"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {isSearching ? (
                    <CircularProgress size={15} color="inherit" />
                  ) : (
                    <i
                      className="fi fi-rr-search"
                      style={{ fontSize: 15, lineHeight: 1, display: "flex" }}
                    />
                  )}
                  {trackCopy.button}
                </Stack>
              </PrimaryButton>
            </Grid>
          </Grid>
        </form>

        {/* Results */}
        {resolvedTrackOrderData && showOrderDetails && (
          <TrackOrderDetails
            trackOrderFormik={trackOrderFormik}
            showOrderDetails={setShowOrderDetails}
            trackOrderData={resolvedTrackOrderData}
            configData={configData}
          />
        )}
      </Stack>
    </CustomStackFullWidth>
  );
};

export default TrackOrderInput;
