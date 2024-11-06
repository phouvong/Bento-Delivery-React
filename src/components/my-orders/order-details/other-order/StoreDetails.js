import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { useRouter } from "next/router";
import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { InformationGrid } from "../../myorders.style";
import MessageSvg from "./MessageSvg";
import StoreAndDeliveryManCommon from "./StoreAndDeliveryManCommon";
import StoreFeature from "./StoreFeature";
import { getToken } from "helper-functions/getToken";
import { toast } from "react-hot-toast";
import { no_chatting_plan } from "utils/toasterMessages";

export const StoreChatButton = styled(Button)(({ theme }) => ({
  height: "42px",
  [theme.breakpoints.down("md")]: {
    height: "33px",
    padding: "6px 6px",
    minWidth: "34px",
  },
}));
export const hasChatAndReview = (storeData) => {
  let isChat = 0;
  let isReview = 0;
  if (storeData?.store_business_model === "commission") {
    isChat = 1;
    isReview = 1;
  } else if (storeData?.store_business_model === "subscription") {
    isChat = storeData.store_sub?.chat ?? 0;
    isReview = storeData.store_sub?.review ?? 0;
  }

  return { isReview, isChat };
};
const StoreDetails = (props) => {
  const { storeData, configData, t } = props;
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = () => {
    router.push({
      pathname: "/profile",
      query: {
        page: "inbox",
        type: "vendor",
        id: storeData?.vendor_id,
        routeName: "vendor_id",
        chatFrom: "true",
        deliveryman_name: storeData?.name,
        deliveryManData_image: storeData?.logo_full_url,
      },
    });
  };

  return (
    <CustomStackFullWidth
      sx={{
        padding: {
          xs: "20px 10px",
          md: "20px 40px",
        },
      }}
    >
      <InformationGrid container spacing={2}>
        <Grid container item md={12} xs={12} spacing={2}>
          <Stack direction="row" width="100%" spacing={1}>
            <StoreAndDeliveryManCommon
              data={storeData}
              configData={configData}
              imageUrl={configData?.base_urls?.store_cover_photo_url}
              image={storeData?.cover_photo_full_url}
            />
            {getToken() && hasChatAndReview(storeData)?.isChat === 1 && (
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

          <Grid item md={12} xs={12}>
            <CustomStackFullWidth
              direction="row"
              gap={{ xs: "15px", sm: "50px", md: "50px" }}
            >
              <StoreFeature
                count={`${storeData?.positive_rating?.toFixed(2)}% `}
                title="Positive Review"
              />
              {storeData?.total_items && (
                <StoreFeature count={storeData?.total_items} title="Products" />
              )}

              <StoreFeature
                count={storeData?.delivery_time}
                title="Delivery Time"
              />
            </CustomStackFullWidth>
          </Grid>
        </Grid>
      </InformationGrid>
    </CustomStackFullWidth>
  );
};

StoreDetails.propTypes = {};

export default StoreDetails;
