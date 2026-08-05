import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { alpha, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import { t } from "i18next";
import moment from "moment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CampaignIcon from "components/campaigns-details/CampaignIcon";

const MiddleSectionShimmer = () => (
  <CustomStackFullWidth spacing={1}>
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      width="100%"
    >
      <Stack
        justifyContent="center"
        alignItems="flex-start"
        width="100%"
        spacing={0.5}
      >
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="70%" height={20} />
      </Stack>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        gap="20px"
        width="100%"
        maxWidth="600px"
        sx={{
          padding: "10px 12px",
          borderRadius: "8px",
          backgroundColor: (theme) => alpha(theme.palette.neutral[400], 0.2),
        }}
      >
        <Skeleton variant="text" width={160} height={24} />
        <Skeleton
          variant="rounded"
          width="100%"
          height={40}
          sx={{ maxWidth: 320, borderRadius: "5px" }}
        />
      </Stack>
    </Stack>
  </CustomStackFullWidth>
);

const MiddleSection = ({ campaignsDetails, image, isLoading }) => {
  const theme = useTheme();
  if (isLoading || !campaignsDetails) {
    return <MiddleSectionShimmer />;
  }
  return (
    <CustomStackFullWidth spacing={1}>
      <Stack
        gap="40ppx"
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        width="100%"
      >
        <Stack justifyContent="center" alignItems="flex-start" width="100%">
          <Typography fontWeight="700" variant="h6">
            {campaignsDetails?.title}
          </Typography>
          <Typography variant="subtitle2" color={theme.palette.neutral[400]}>
            {campaignsDetails?.description}
          </Typography>
        </Stack>
        <Stack
          sx={{
            backgroundColor: (theme) => alpha(theme.palette.neutral[400], 0.2),
            padding: "10px 12px",
            borderRadius: "8px",
            maxWidth: "600px",
          }}
          justifyContent={{ xs: "center", md: "space-between" }}
          alignItems="center"
          direction={{ xs: "column", md: "row" }}
          width="100%"
          gap="20px"
        >
          <Stack direction="row" gap="8px" alignItems="center">
            <CampaignIcon />
            <Typography fontWeight="500">{t("Campaign Duration")}</Typography>
          </Stack>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            gap={{ xs: 1, md: 1.25 }}
            width={{ xs: "100%", md: "auto" }}
            flexWrap="wrap"
            sx={{
              bgcolor: (theme) => theme.palette.neutral[100],
              borderRadius: 1, // 5px ≈ 1 spacing unit
              px: 1.25, // padding left & right (10px)
              py: 1, // padding top & bottom (8px)
            }}
          >
            <Typography sx={{ whiteSpace: { md: "nowrap" } }}>
              {campaignsDetails?.available_date_starts
                ? moment(
                    campaignsDetails.available_date_starts.replace(
                      /(\d+)(st|nd|rd|th)/,
                      "$1"
                    )
                  ).format("MMM D, YYYY")
                : "N/A"}
              {" - "}
              {campaignsDetails?.available_date_ends
                ? moment(
                    campaignsDetails.available_date_ends.replace(
                      /(\d+)(st|nd|rd|th)/,
                      "$1"
                    )
                  ).format("MMM D, YYYY")
                : "N/A"}
            </Typography>
            <Typography
              sx={{
                display: { xs: "none", md: "block" },
                color: (theme) => theme.palette.neutral[400],
              }}
            >
              |
            </Typography>
            <Typography sx={{ whiteSpace: { md: "nowrap" } }}>
              {moment(campaignsDetails?.start_time, ["HH:mm"]).format(
                "hh:mm a"
              )}{" "}
              -{" "}
              {moment(campaignsDetails?.end_time, ["HH:mm"]).format("hh:mm a")}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </CustomStackFullWidth>
  );
};

export default MiddleSection;
