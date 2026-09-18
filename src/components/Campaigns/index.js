import React, { useEffect } from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
import CampaignCard from "./CampaignCard";
import useGetBasicCampaigns from "../../api-manage/hooks/react-query/useGetBasicCampaigns";
import CustomContainer from "components/container";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import { t } from "i18next";

const CampaignsPage = () => {
  const { data, refetch, isLoading, isFetching } = useGetBasicCampaigns();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <CustomStackFullWidth mt={{ xs: 0, md: "60px" }}>
      <SimpleMobileHeader title="Campaigns" />
      <CustomContainer sx={{ paddingTop: "20px", paddingBottom: "40px" }}>
        <Stack spacing={{ xs: 2, md: 3 }}>
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              fontSize: { xs: "18px", md: "24px" },
              fontWeight: 700,
              color: "neutral.1050",
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
            }}
            component="h1"
          >
            {t("Campaigns")}
          </Typography>

          <Box sx={{ overflow: "hidden", width: "100%" }}>
            <Grid
              container
              spacing={{ xs: 2, md: 2.5 }}
              sx={{ width: "100%", mx: 0, py: "5px" }}
            >
              {data?.length > 0 &&
                data?.map((camp, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <CampaignCard data={camp} />
                  </Grid>
                ))}
              {isLoading && (
                <>
                  {[...Array(6)].map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Skeleton
                        variant="rounded"
                        width="100%"
                        height="290px"
                        sx={{ borderRadius: "16px" }}
                      />
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </Box>

          {!isLoading && data?.length === 0 && (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ py: { xs: "60px", md: "80px" } }}
            >
              <Stack
                sx={{
                  width: { xs: "80px", md: "100px" },
                  height: { xs: "80px", md: "100px" },
                  borderRadius: "50%",
                  backgroundColor: "primary.light",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="fi fi-rr-megaphone"
                  style={{
                    fontSize: "36px",
                    display: "flex",
                    lineHeight: 1,
                    color: "var(--mui-palette-primary-main, #FC6B0E)",
                  }}
                />
              </Stack>
              <Typography
                sx={{
                  fontSize: { xs: "16px", md: "18px" },
                  fontWeight: 700,
                  color: "neutral.1050",
                  letterSpacing: "-0.5px",
                }}
              >
                {t("No campaigns available")}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CustomContainer>
    </CustomStackFullWidth>
  );
};

export default CampaignsPage;
