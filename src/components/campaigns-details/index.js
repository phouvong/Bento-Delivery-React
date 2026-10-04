import React, { useEffect } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import { Stack } from "@mui/material";
import MiddleSection from "./MiddleSection";
import ItemSection from "./ItemSection";
import { useTheme } from "@emotion/react";
import { useRouter } from "next/router";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import CustomContainer from "components/container";

const CampaignsDetails = ({ campaignsDetails, isRefetching, isLoading }) => {
  const theme = useTheme();
  const router = useRouter();
  const camImage = campaignsDetails?.image_full_url;
  useEffect(() => {
    // Wait for query to be available
    if (router.isReady) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [router.isReady]);
  return (
    <CustomStackFullWidth mt={{ xs: 0, md: "60px" }}>
      <SimpleMobileHeader title={campaignsDetails?.title ?? "Campaigns"} />
      <CustomContainer sx={{ paddingTop: "20px" }}>
        <Stack spacing={4} justifyContent="center" alignItems="center">
          <CustomImageContainer
            src={camImage}
            width="100%"
            height="300px"
            smHeight="150px"
            objectfit="cover"
            borderRadius=".5rem"
          />
          <CustomPaperBigCard
            sx={{ padding: "20px" }}
            backgroundcolor={theme.palette.background.custom2}
          >
            <CustomStackFullWidth>
              <MiddleSection
                campaignsDetails={campaignsDetails}
                image={camImage}
                isLoading={isLoading}
              />
              <ItemSection
                campaignsDetails={campaignsDetails}
                isLoading={isLoading}
                isRefetching={isRefetching}
              />
            </CustomStackFullWidth>
          </CustomPaperBigCard>
        </Stack>
      </CustomContainer>
    </CustomStackFullWidth>
  );
};

export default CampaignsDetails;
