import React, { useState } from "react";
import { Box, Grid, Skeleton, Stack, Typography, styled } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/router";
import CustomContainer from "components/container";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import NextImage from "components/NextImage";
import BogoStoreOfferCard from "./BogoStoreOfferCard";
import BogoItemDetailsModal from "./BogoItemDetailsModal";
import useGetBogoOfferDetails from "api-manage/hooks/react-query/bogo/useGetBogoOfferDetails";

const SidebarPanel = styled(Stack)(({ theme }) => ({
  width: "100%",
  maxWidth: "366px",
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.1), 0px 1px 4px 0px rgba(0,0,0,0.05)",
  overflow: "hidden",
  position: "sticky",
  top: "88px",
  [theme.breakpoints.down("md")]: {
    position: "static",
    maxWidth: "100%",
  },
}));

const BannerImage = styled(Box)({
  position: "relative",
  width: "calc(100% - 8px)",
  aspectRatio: "354 / 118",
  borderRadius: "16px 16px 0 0",
  overflow: "hidden",
  margin: "4px 4px 0",
});

const InfoBox = styled(Stack)(({ theme }) => ({
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: theme.palette.background.secondary,
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

const BogoOfferDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useGetBogoOfferDetails(id);
  const offer = data?.offer;
  const bundles = data?.bundles ?? [];
  const isEmpty = !isLoading && bundles.length === 0;

  const [activeBundle, setActiveBundle] = useState(null);

  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const moduleLabel = moduleParam
    ? moduleParam.charAt(0).toUpperCase() + moduleParam.slice(1)
    : t("Home");
  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";
  const bogoListHref = moduleParam ? `/bogo-list?module=${moduleParam}` : "/bogo-list";

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
            <BannerImage>
              <NextImage src={offer?.image_full_url} alt={offer?.title} fill objectFit="cover" />
            </BannerImage>

            <Box sx={{ px: "12px", pt: "12px" }}>
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
                  {
                    key: "bogo-list",
                    label: t("BOGO Offer"),
                    onRedirect: bogoListHref,
                  },
                  { key: "bogo-details", label: t("BOGO Offer Details") },
                ]}
              />
            </Box>

            <Stack sx={{ px: "12px", pb: "20px", pt: "16px", gap: "16px" }}>
              {isLoading ? (
                <Stack sx={{ gap: "8px", alignItems: "center" }}>
                  <Skeleton variant="text" width="80%" height={28} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="90%" height={20} />
                </Stack>
              ) : (
                <Stack sx={{ gap: "8px", textAlign: "center" }}>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: "20px",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "-0.6px",
                      color: "neutral.1050",
                    }}
                  >
                    {offer?.title}
                  </Typography>
                  <Typography sx={{ fontSize: "16px", lineHeight: 1.3, color: "neutral.500" }}>
                    {offer?.description}
                  </Typography>
                </Stack>
              )}

              {isLoading ? (
                <Skeleton variant="rounded" width="100%" height={64} sx={{ borderRadius: "8px" }} />
              ) : (
                <InfoBox>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      letterSpacing: "-0.54px",
                      color: "info.main",
                    }}
                  >
                    {t("Buy {{buy}} Get {{get}} Free", {
                      buy: offer?.buy_qty ?? 1,
                      get: offer?.get_qty ?? 1,
                    })}
                  </Typography>
                  {offer?.valid_until && (
                    <Stack direction="row" alignItems="center" gap="4px">
                      <Typography sx={{ fontSize: "14px", color: "neutral.500" }}>
                        {t("Valid Until")}
                      </Typography>
                      <Typography sx={{ fontSize: "14px", color: "neutral.500" }}>:</Typography>
                      <Typography sx={{ fontSize: "14px", color: "neutral.500" }}>
                        {offer.valid_until}
                      </Typography>
                    </Stack>
                  )}
                </InfoBox>
              )}
            </Stack>
          </SidebarPanel>

          <ContentPanel>
            <Stack sx={{ gap: "24px" }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-1.2px",
                  color: "neutral.1050",
                }}
              >
                {t("Explore Offer")}
              </Typography>

              <Grid container spacing={3}>
                {bundles.map((bundle) => (
                  <Grid item xs={12} sm={6} key={bundle?.bundle_id}>
                    <BogoStoreOfferCard
                      bundle={bundle}
                      onClick={() => setActiveBundle(bundle)}
                    />
                  </Grid>
                ))}

                {isLoading &&
                  [...Array(4)].map((_, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Skeleton
                        variant="rounded"
                        width="100%"
                        height={182}
                        sx={{ borderRadius: "12px" }}
                      />
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
                    {t("No stores are running this offer right now.")}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </ContentPanel>
        </Stack>
      </CustomContainer>

      {activeBundle && (
        <BogoItemDetailsModal
          open={!!activeBundle}
          onClose={() => setActiveBundle(null)}
          bundle={activeBundle}
          offer={offer}
        />
      )}
    </CustomStackFullWidth>
  );
};

export default BogoOfferDetailsPage;
