import React from "react";
import { alpha, Stack, Typography } from "@mui/material";
import CustomImageContainer from "components/CustomImageContainer";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import { t } from "i18next";
import { Box } from "@mui/system";
import { getReachedTime } from "components/home/module-wise-components/rental/components/trip-status/tripstatusHelper";
import moment from "moment";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import giftbox from "../../asset/success.gif";
import loadingGif from "../../asset/loading.gif";

const getStatusConfig = (tripDetails) => ({
  pending: {
    text: (
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: "normal",
          color: (theme) => theme.palette.neutral[600],
          maxWidth: "280px",
        }}
      >
        {t("Your Trip is")}{" "}
        <Typography
          component="span"
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: (theme) => theme.palette.neutral[1000],
          }}
        >
          {t("Pending")}
        </Typography>
        , {t("Please Wait for Provider Confirmation")}
      </Typography>
    ),
    content: <CustomImageContainer src="/static/rental/cartrip.png" />,
  },
  confirmed: {
    text: (
      <>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            color: (theme) => theme.palette.neutral[1000],
          }}
        >
          {t("Your trip is confirmed")}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            color: (theme) => theme.palette.neutral[600],
            maxWidth: "280px",
          }}
        >
          {t(`Driver will arrived soon to the pickup location`)}
        </Typography>
      </>
    ),
    content: (
      <CustomImageContainer
        src={loadingGif?.src}
        width="238px"
        borderRadius="50rem"
        objectfit="cover"
        height="50px"
      />
    ),
  },
  canceled: {
    text: (
      <>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            color: (theme) => theme.palette.neutral[1000],
          }}
        >
          {t("Your trip is canceled")}
        </Typography>
      </>
    ),
    content: <CustomImageContainer src={"/static/rental/cartrip.png"} />,
  },
  payment_failed: {
    text: (
      <>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            color: (theme) => theme.palette.neutral[1000],
          }}
        >
          {t("Payment failed")}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            color: (theme) => theme.palette.neutral[600],
            maxWidth: "280px",
          }}
        >
          {t(
            "Your payment was not successful. Please try again to complete the trip"
          )}
        </Typography>
      </>
    ),
    content: <CustomImageContainer src="/static/rental/cartripLocation.png" />,
  },
  completed: {
    text: (
      <Stack>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            color: (theme) => theme.palette.neutral[1000],
          }}
        >
          {t("Your Trip has been ")}{" "}
          <Typography
            component="span"
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: (theme) => theme.palette.neutral[1000],
            }}
          >
            {t("completed")}
          </Typography>
        </Typography>
        <Typography component="span">
          {moment(tripDetails?.schedule_at, "YYYY-MM-DD HH:mm:ss").format(
            "DD MMM, YYYY, hh:mm a"
          )}{" "}
          -{" "}
          {moment(tripDetails?.completed, "YYYY-MM-DD HH:mm:ss").format(
            "DD MMM, YYYY, hh:mm a"
          )}
        </Typography>
      </Stack>
    ),
    content: (
      <>
        {tripDetails?.trip_type === "hourly" ? (
          <Stack spacing={0.5} textAlign="center">
            <Typography fontWeight="600" fontSize="12px">
              {t("Total trip cost")}
            </Typography>
            <Typography
              fontWeight="700"
              fontSize="26px"
              sx={{ color: (theme) => theme.palette.primary.main }}
            >
              {getAmountWithSign(tripDetails?.trip_amount)}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              justifyContent="center"
            >
              <HourglassEmptyOutlinedIcon
                sx={{ width: "18px", height: "18px", marginBottom: "3px" }}
              />
              <Typography>{t("Total Hour")} -</Typography>
              <Typography fontWeight="700">
                {tripDetails?.estimated_hours}
              </Typography>
            </Stack>
          </Stack>
        ) : (
          <Stack textAlign="center">
            <Typography fontWeight="600" fontSize="12px">
              {t("Total trip cost")}
            </Typography>
            <Typography fontWeight="700" fontSize="26px">
              {getAmountWithSign(tripDetails?.trip_amount)}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0.5}
            >
              <HourglassEmptyOutlinedIcon sx={{ fontSize: "18px" }} />
              <Typography>{t("Total")} - </Typography>
              {tripDetails?.trip_type === "day_wise" ? <Typography fontWeight="700">
                {tripDetails?.estimated_hours/24} days
              </Typography>: <Typography fontWeight="700">
                {tripDetails?.distance?.toFixed(1)} Km
              </Typography>}
            </Stack>
          </Stack>
        )}
      </>
    ),
  },
  ongoing: {
    text: (
      <>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: "normal",
            color: (theme) => theme.palette.neutral[600],
            maxWidth: "280px",
          }}
        >
          {t("Your trip is")}{" "}
          <Typography
            component="span"
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: (theme) => theme.palette.neutral[1000],
            }}
          >
            {t("On-going")}{" "}
          </Typography>
          {t("You’ll reach your destination approximately in")}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "16px", md: "23px" },
            fontWeight: 600,
            color: (theme) => alpha(theme.palette.neutral[1000], 0.8),
          }}
        >
          {getReachedTime(tripDetails) ? (
            <>
              15 - 20 <span>{t("mins")}</span>
            </>
          ) : (
            moment(
              tripDetails?.estimated_trip_end_time,
              "YYYY-MM-DD HH:mm:ss"
            ).format("DD MMM, YYYY, hh:mm a")
          )}
        </Typography>
      </>
    ),
    content: <CustomImageContainer src="/static/rental/cartrip.png" />,
  },
  destination: {
    text: (
      <>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            color: (theme) => theme.palette.neutral[1000],
          }}
        >
          {t("The driver has reached the destination")}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "normal",
            color: (theme) => theme.palette.neutral[600],
          }}
        >
          {t(
            "You just reached the destination, please make payment to complete the trip"
          )}
        </Typography>
      </>
    ),
    content: <CustomImageContainer src="/static/rental/cartripLocation.png" />,
  },
});

const TripStatusActivity = ({ status = "destination", tripDetails }) => {
  const STATUS_CONFIG = getStatusConfig(tripDetails);
  const { text, content } = STATUS_CONFIG[status] || {
    text: t("Unknown status."),
    content: null,
  };

  return (
    <Box
      sx={{
        py: "20px",
        px: "30px",
        mb: "20px",
        borderRadius: "20px",
        display: "flex",
        gap: "20px",
        justifyContent: "space-between",
        flexWrap: "wrap",
        alignItems: "center",
        background: (theme) => alpha(theme.palette.neutral[200], 0.4),
        flexDirection: { xs: "column-reverse", md: "row" },
      }}
    >
      {tripDetails?.trip_status === "completed" &&
      tripDetails?.payment_status === "paid" ? (
        <>
          <Typography
            component="span"
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              color: (theme) => theme.palette.neutral[1000],
            }}
          >
            {t("Your Payment ")}
            <Typography component="span" fontWeight="700" fontSize="16px">
              {t("Completed Successfully")}
            </Typography>
          </Typography>
          <CustomImageContainer
            src={giftbox?.src}
            width="90px"
            borderRadius=".6rem"
            objectfit="contain"
          />
        </>
      ) : (
        <>
        
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography fontSize="14px" fontWeight="600">{t("Trip Id")} : {tripDetails?.id}</Typography>
            {text}
            </Box>
          <Box sx={{ marginInline: { xs: "auto", md: "inherit" } }}>
            {content}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TripStatusActivity;
