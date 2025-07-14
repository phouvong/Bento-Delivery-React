import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {  Card,  Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import CustomImageContainer from "../../CustomImageContainer";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import { CustomButtonStack } from "components/checkout/CheckOut.style";

const ParcelInfo = ({ parcelCategories }) => {
  return (
    <CustomStackFullWidth>
      <Card sx={{ padding: "1.2rem " }}>
        <CustomStackFullWidth spacing={3}>
          <Stack direction="row" justifyCenter="center" alignItems="center">
            <Stack justifyCenter="center" alignItems="center" flexGrow="1">
              <Typography variant="h6">{t("Parcel Info")}</Typography>
            </Stack>
          </Stack>

          <Stack
            width="100%"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            paddingTop="20px"
            paddingBottom={{ xs: "20px", sm: "40px", md: "50px" }}
          >
            <CustomImageContainer
              src={parcelCategories?.image_full_url}
              height="216px"
              width="216px"
              smWidth="172px"
              smHeight="172px"
              objectfit="contain"
            />
            <Stack width="100%" justifyContent="center" alignItems="center">
              <Typography variant="h6" fontWeight="500">
                {parcelCategories?.name}
              </Typography>
              <Typography>{parcelCategories?.description}</Typography>
            </Stack>
          </Stack>

          <CustomButtonStack width="100%" paddingBottom="25px">
            <CustomButtonPrimary fullwidth="true" type="submit">
              {t("Proceed to Checkout")}
            </CustomButtonPrimary>
          </CustomButtonStack>
        </CustomStackFullWidth>
      </Card>
    </CustomStackFullWidth>
  );
};

export default ParcelInfo;
