import React from "react";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import StoreAndDeliveryManCommon from "./StoreAndDeliveryManCommon";
import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import MessageSvg from "./MessageSvg";
import { t } from "i18next";
import { useRouter } from "next/router";
import { Stack } from "@mui/system";
import { hasChatAndReview, StoreChatButton } from "./StoreDetails";
import { getToken } from "../../../../helper-functions/getToken";

const DeliveryManInfo = ({ configData, deliveryManData, storeData, isBooking, isServiceman }) => {
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = () => {
    router.push({
      pathname: "/profile",
      query: {
        page: "inbox",
        type: "delivery_man",
        id: deliveryManData?.id,
        routeName: "delivery_man_id",
        chatFrom: "true",
        deliveryman_name: deliveryManData?.f_name,
        deliveryManData_image: deliveryManData?.image_full_url,
      },
    });
  };

  return (
    <CustomStackFullWidth
      sx={{
        padding: isServiceman
          ? { xs: "10px", md: "12px 10px" }
          : {
              xs: "20px 10px",
              md: isBooking ? "20px 40px" : "20px 20px",
            },
        // The 30vh min-height sized a single full-tab delivery-man slide;
        // the serviceman list stacks multiple compact cards instead.
        minHeight: isServiceman ? "auto" : "30vh",
      }}
    >
      <Grid container>
        <Grid container item md={12} xs={12}>
          <Stack direction="row" width="100%" spacing={1}>
            <StoreAndDeliveryManCommon
              data={deliveryManData}
              imageUrl={configData?.base_urls?.delivery_man_image_url}
              image={deliveryManData?.image_full_url}
              fromDelivery="true"
              isServiceman={isServiceman}
            />
            {!isServiceman && getToken() && hasChatAndReview(storeData)?.isChat === 1 && (
              <StoreChatButton
                variant="contained"
                startIcon={!isSmall && <MessageSvg />}
                onClick={handleClick}
                sx={{ height: "42px" }}
              >
                {isSmall ? <MessageSvg /> : t("See Chat History")}
              </StoreChatButton>
            )}
          </Stack>
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

export default DeliveryManInfo;
