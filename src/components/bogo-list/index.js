import React from "react";
import { Box, Grid, Skeleton, Stack, Typography, styled } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/router";
import CustomContainer from "components/container";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import BogoOfferBadgeIcon from "./BogoOfferBadgeIcon";
import BogoOfferCard from "./BogoOfferCard";
import useGetBogoHome from "api-manage/hooks/react-query/bogo/useGetBogoHome";
import useGetBogoOffers from "api-manage/hooks/react-query/bogo/useGetBogoOffers";

const SidebarPanel = styled(Stack)(({ theme }) => ({
  width: "100%",
  maxWidth: "366px",
  flexShrink: 0,
  gap: "16px",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.1), 0px 1px 4px 0px rgba(0,0,0,0.05)",
  position: "sticky",
  top: "88px",
  [theme.breakpoints.down("md")]: {
    position: "static",
    maxWidth: "100%",
  },
}));

const ContentPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.1), 0px 1px 4px 0px rgba(0,0,0,0.05)",
  padding: "24px",
  [theme.breakpoints.up("md")]: {
    maxHeight: "calc(100vh - 88px)",
    overflowY: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

const BogoListPage = () => {
  const router = useRouter();
  const { data: bogoHome } = useGetBogoHome();
  const { data: bogoOffers, isLoading } = useGetBogoOffers();

  // Read the module from the URL (not localStorage) so the breadcrumb label
  // matches on the server-rendered HTML and the client's first paint —
  // localStorage isn't available during SSR and would cause a hydration
  // mismatch here.
  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const moduleLabel = moduleParam
    ? moduleParam.charAt(0).toUpperCase() + moduleParam.slice(1)
    : t("Home");
  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";

  const offers = bogoOffers?.data ?? [];
  const isEmpty = !isLoading && offers.length === 0;

  return (
    <CustomStackFullWidth>
      <CustomContainer
        sx={{
          paddingTop: { xs: "16px", md: "48px" },
          paddingBottom: { xs: "24px", md: "40px" },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2.5, md: "32px" }}
          alignItems={{ xs: "stretch", md: "flex-start" }}
        >
          <SidebarPanel>
            <Box sx={{ alignSelf: "flex-start" }}>
              <CustomPageBreadCrumb
                items={[
                  {
                    key: "module",
                    label: moduleLabel,
                    icon: (
                      <i
                        className="fi fi-rr-home"
                        style={{ fontSize: 12, display: "flex", lineHeight: 1 }}
                      />
                    ),
                    onRedirect: homeHref,
                  },
                  { key: "bogo", label: t("BOGO Offer") },
                ]}
              />
            </Box>

            <Box sx={{ width: "100px", height: "100px" }}>
              <BogoOfferBadgeIcon />
            </Box>
            <Typography
              component="h1"
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-1.2px",
                color: "neutral.1050",
              }}
            >
              {t("Hurry Up! BOGO Offer Is Live")}
            </Typography>
            <Typography sx={{ fontSize: "16px", lineHeight: 1.3, color: "neutral.500" }}>
              {bogoHome?.description ||
                t(
                  "Get the best value from your order with our exclusive BOGO deals. Choose eligible products, complete your purchase, and enjoy complimentary items with your order.",
                )}
            </Typography>
          </SidebarPanel>

          <ContentPanel>
            <Grid container spacing={3}>
              {offers.map((offer) => (
                <Grid item xs={12} sm={6} key={offer?.id}>
                  <BogoOfferCard data={offer} />
                </Grid>
              ))}

              {isLoading &&
                [...Array(4)].map((_, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      sx={{ aspectRatio: "354 / 118", borderRadius: "12px", mb: "12px" }}
                    />
                    <Skeleton variant="text" width="60%" height={28} />
                    <Skeleton variant="text" width="40%" height={22} />
                    <Skeleton variant="text" width="90%" height={22} />
                  </Grid>
                ))}
            </Grid>

            {isEmpty && (
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
                    className="fi fi-rr-gift"
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
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "neutral.1050",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {t("No BOGO offers available")}
                </Typography>
              </Stack>
            )}
          </ContentPanel>
        </Stack>
      </CustomContainer>
    </CustomStackFullWidth>
  );
};

export default BogoListPage;
