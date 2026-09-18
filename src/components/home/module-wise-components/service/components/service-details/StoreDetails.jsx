import { useTheme } from "@mui/material";
import {
  alpha,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getStoreRedirectURL } from "helper-functions/handleStoreRedirect";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomImageContainer from "components/CustomImageContainer";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";

const CustomWrapper = styled(Paper)(({ theme }) => ({
  padding: "12px",
  borderRadius: "12px",
  background: theme.palette.background.paper,
  //border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
}));

const StatCard = styled("div")(({ theme, highlighted }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "8px 8px",
  borderRadius: "10px",
  border: highlighted ? `1px solid ${theme.palette.primary.main}` : "none",
  backgroundColor: alpha(
    theme.palette.neutral?.[400] || theme.palette.text.secondary,
    0.08
  ),
  minHeight: "56px",
  width: "100%",
}));

const StoreDetails = ({ storeDetails }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [liked, setLiked] = useState(false);

  const addToFavorite = () => setLiked(true);
  const deleteWishlistStore = () => setLiked(false);

  const handleVisitStore = () => {
    router.push(getStoreRedirectURL(storeDetails));
  };

  const deliveryTime = storeDetails?.delivery_time?.split(" ");
  const itemsCount =
    storeDetails?.total_items > 0 ? storeDetails?.total_items - 1 : 0;

  const showPositiveReviews = Number(storeDetails?.positive_rating) > 0;
  const showMinOrder = Number(storeDetails?.minimum_order) > 0;
  const visibleStatCount =
    1 + (showPositiveReviews ? 1 : 0) + (showMinOrder ? 1 : 0);
  const statColXs = 12 / visibleStatCount;

  const headerIconSx = {
    width: 32,
    height: 32,
    borderRadius: "8px",
    border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      backgroundColor: alpha(theme.palette.text.primary, 0.04),
    },
  };

  return (
    <CustomWrapper>
      <Stack spacing={0.75}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "18px", md: "24px" },
              color: theme.palette.text.primary,
            }}
          >
            {t("Provider")}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip
              title={liked ? t("Remove from wishlist") : t("Add to wishlist")}
            >
              <IconButton
                onClick={() =>
                  liked ? deleteWishlistStore() : addToFavorite()
                }
                sx={headerIconSx}
              >
                <i
                  className={liked ? "fi fi-sr-heart" : "fi fi-rr-heart"}
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    lineHeight: 1,
                    color: liked
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("Visit provider")}>
              <IconButton onClick={handleVisitStore} sx={headerIconSx}>
                <i
                  className="fi fi-rr-arrow-up-right-from-square"
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    lineHeight: 1,
                    color: theme.palette.text.secondary,
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <CustomStackFullWidth
            sx={{
              position: "relative",
              height: 56,
              width: 56,
              flexShrink: 0,
              borderRadius: "50%",
              border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
              overflow: "hidden",
            }}
          >
            <CustomImageContainer
              src={storeDetails?.logo_full_url}
              height="100%"
              width="100%"
              obejctfit="cover"
              borderRadius="50%"
            />
          </CustomStackFullWidth>
          <Stack spacing={0.25} minWidth={0} flex={1}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "14px", md: "15px" },
                  color: theme.palette.text.primary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {storeDetails?.name}
              </Typography>
              <VerifiedStoreBadge
                verified={storeDetails?.verified_seller}
                fontSize="14px"
              />
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <i
                className="fi fi-sr-star"
                style={{
                  color: theme.palette.warning.main,
                  fontSize: "12px",
                  display: "flex",
                  lineHeight: 1,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "12px", md: "13px" },
                  color: theme.palette.text.primary,
                }}
              >
                {storeDetails?.avg_rating?.toFixed?.(1) ??
                  storeDetails?.avg_rating}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  color: theme.palette.text.secondary,
                }}
              >
                {itemsCount} {t("Items")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Grid container spacing={0.75}>
          {showPositiveReviews && (
            <Grid item xs={statColXs}>
              <StatCard>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "14px", md: "15px" },
                    color: theme.palette.primary.main,
                    lineHeight: 1.15,
                  }}
                >
                  {storeDetails?.positive_rating?.toFixed(0) ?? 0}%
                </Typography>
                <Typography
                  sx={{
                    fontSize: isSmall ? "10px" : "11px",
                    color: theme.palette.text.secondary,
                    mt: 0.5,
                  }}
                >
                  {t("Positive Reviews")}
                </Typography>
              </StatCard>
            </Grid>
          )}
          <Grid item xs={statColXs}>
            <StatCard>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "13px", md: "14px" },
                  color: theme.palette.text.primary,
                  lineHeight: 1.15,
                  whiteSpace: "nowrap",
                }}
              >
                {deliveryTime?.[0]} {deliveryTime?.[1]}
              </Typography>
              <Typography
                sx={{
                  fontSize: isSmall ? "10px" : "11px",
                  color: theme.palette.text.secondary,
                  mt: 0.5,
                }}
              >
                {t("Delivery Time")}
              </Typography>
            </StatCard>
          </Grid>
          {showMinOrder && (
            <Grid item xs={statColXs}>
              <StatCard>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "14px", md: "15px" },
                    color: theme.palette.primary.main,
                    lineHeight: 1.15,
                  }}
                >
                  {getAmountWithSign(storeDetails?.minimum_order)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: isSmall ? "10px" : "11px",
                    color: theme.palette.text.secondary,
                    mt: 0.5,
                  }}
                >
                  {t("Min Order")}
                </Typography>
              </StatCard>
            </Grid>
          )}
        </Grid>
      </Stack>
    </CustomWrapper>
  );
};

StoreDetails.propTypes = {};

export default React.memo(StoreDetails);
