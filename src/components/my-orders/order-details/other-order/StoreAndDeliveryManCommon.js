import React from "react";
import { alpha, Grid, Typography, useTheme } from "@mui/material";
import CustomImageContainer from "../../../CustomImageContainer";
import { Stack } from "@mui/system";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import CustomRatings from "../../../search/CustomRatings";
import { t } from "i18next";
import { getImageUrl } from "utils/CustomFunctions";
const StoreAndDeliveryManCommon = ({
  data,
  imageUrl,
  image,
  fromDelivery,
  configData,
}) => {
  const theme = useTheme();

  const totalOrderText = t("Delivery Completed");
  const avgRating = Number(data?.avg_rating || 0);
  const ratingCount = Number(data?.rating_count || 0);
  const shouldShowRatings = avgRating > 0 && ratingCount > 0;
  return (
    <>
      <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ width: "100%" }}>
      <Stack sx={{ flexShrink: 0 }}>
        {data && (
          <CustomImageContainer
            src={image}
            height="100px"
            smWidth="60px"
            smHeight="60px"
            borderRadius=".5rem"
            width="100px"
            objectfit="cover"
          />
        )}
      </Stack>
      <Stack alignSelf="center" sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={0.6}>
          <Typography
            fontWeight="600"
            fontSize={{ xs: "14px", md: "20px" }}
          >
            {data && data?.name ? data?.name : data?.f_name}
          </Typography>
          {data?.name && (
            <VerifiedStoreBadge verified={data?.verified_seller} />
          )}
        </Stack>
        {shouldShowRatings && (
          <Stack direction="row" alignItems="center">
            <CustomRatings
              readOnly="true"
              ratingValue={avgRating}
              color={theme.palette.warning.new}
            />
            <Typography
              fontSize={{ xs: "10px", md: "13.4px" }}
              fontWeight="700"
            >
              ({avgRating.toFixed(2)})
            </Typography>

            <Typography
              fontSize={{ xs: "10px", md: "13.4px" }}
              fontWeight="700"
              ml="9px"
              paddingLeft="9px"
              sx={{
                //textDecoration: "underLine",
                borderLeft: "2px solid",
                borderColor: (theme) => alpha(theme.palette.neutral[400], 0.4),
                color: (theme) => alpha(theme.palette.neutral[600], 0.9),
              }}
            >
              {ratingCount} {t("Reviews")}
            </Typography>
          </Stack>
        )}
        {fromDelivery !== "true" ? (
          <Typography fontSize={{ xs: "10px", md: "13.4px" }} mt="3px">
            {t("Address")} : {data && data?.address}
          </Typography>
        ) : (
          <Typography fontSize={{ xs: "10px", md: "13.4px" }}>
            {`${data?.order_count} ${totalOrderText}`}{" "}
          </Typography>
        )}
      </Stack>
      </Stack>
    </>
  );
};

export default StoreAndDeliveryManCommon;
