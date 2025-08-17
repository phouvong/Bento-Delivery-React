import React, {useEffect} from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import { Stack } from "@mui/material";
import MiddleSection from "./MiddleSection";
import ItemSection from "./ItemSection";
import { useTheme } from "@emotion/react";
import {useRouter} from "next/router";

const CampaignsDetails = ({ campaignsDetails, isRefetching, isLoading }) => {
  const theme = useTheme();
  const router = useRouter();
  const camImage = campaignsDetails?.image_full_url;
  useEffect(() => {
    // Wait for query to be available
    if (router.isReady) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [router.isReady]);
  return (
    <CustomStackFullWidth pt="20px">
      <Stack spacing={4} justifyContent="center" alignItems="center">
        <CustomImageContainer
          src={camImage}
          width="100%"
          height="300px"
          smHeight="150px"
          objectfit="cover"
          borderRadius=".5rem"
        />
        <CustomPaperBigCard sx={{padding:"20px"}}  backgroundcolor={theme.palette.background.custom2}>
          <CustomStackFullWidth >
            <MiddleSection
              campaignsDetails={campaignsDetails}
              image={camImage}
            />
            <ItemSection
              campaignsDetails={campaignsDetails}
              isLoading={isLoading}
              isRefetching={isRefetching}
            />
          </CustomStackFullWidth>
        </CustomPaperBigCard>
      </Stack>
    </CustomStackFullWidth>
  );
};

export default CampaignsDetails;
