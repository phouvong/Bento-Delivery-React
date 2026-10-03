import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import CustomModal from "components/modal";
import NextImage from "components/NextImage";
import useGetHappyHourStores from "api-manage/hooks/react-query/happy-hour/useGetHappyHourStores";
import useCountdown, { pad } from "api-manage/hooks/custom-hooks/useCountdown";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

const OfferHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.happyHourBanner.bg,
  borderRadius: "16px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "row",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const Cover = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "50%",
  flexShrink: 0,
  aspectRatio: "418 / 178",
  borderRadius: "16px",
  overflow: "hidden",
  "& img": {
    position: "absolute",
    inset: 0,
    width: "100% !important",
    height: "100% !important",
    objectFit: "cover",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
  padding: "20px 20px 32px 20px",
  width: "50%",
  flex: 1,
  minWidth: 0,
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    gap: "16px",
    padding: "16px",
  },
}));

const TimerRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    order: -1,
  },
}));

const shouldForwardTight = (prop) => prop !== "tight";

// tight: the 4-segment day case on mobile needs smaller boxes/type to fit the
// drawer width without clipping.
const TimerBox = styled(Box, { shouldForwardProp: shouldForwardTight })(
  ({ theme, tight }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tight ? "2px" : "4px",
    backgroundColor: theme.palette.happyHourBanner.timerBg,
    borderRadius: "6px",
    padding: "4px 12px",
    width: "80px",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
      padding: tight ? "4px 8px" : "6px 12px",
    },
  }),
);

const TimerNumber = styled(Typography, {
  shouldForwardProp: shouldForwardTight,
})(({ theme, tight }) => ({
  color: theme.palette.whiteContainer.main,
  fontWeight: 700,
  fontSize: "24px",
  letterSpacing: "-1.2px",
  lineHeight: 1.1,
  fontVariantNumeric: "tabular-nums",
  fontFeatureSettings: '"tnum"',
  whiteSpace: "nowrap",
  [theme.breakpoints.down("sm")]: {
    fontSize: tight ? "13px" : "16px",
    letterSpacing: "-0.39px",
  },
}));

const TimerLabel = styled(Typography, {
  shouldForwardProp: shouldForwardTight,
})(({ theme, tight }) => ({
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: 1.3,
  color: theme.palette.whiteContainer.main,
  whiteSpace: "nowrap",
  [theme.breakpoints.down("sm")]: {
    fontSize: tight ? "11px" : "16px",
  },
}));

const ColonSeparator = styled(Typography, {
  shouldForwardProp: shouldForwardTight,
})(({ theme, tight }) => ({
  color: theme.palette.happyHourBanner.timerColonWarm,
  fontWeight: 700,
  fontSize: "16px",
  letterSpacing: "-0.48px",
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    fontSize: tight ? "13px" : "16px",
  },
}));

const StoreShimmer = () => (
  <Skeleton
    variant="rounded"
    width="100%"
    height={200}
    sx={{ borderRadius: "12px" }}
  />
);

const HappyHourViewModal = ({ openModal, handleClose, happyHour, expireAt }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetched lazily — the query stays idle until the modal is actually open.
  const { data, isLoading } = useGetHappyHourStores(
    { running: true, limit: 100, offset: 1 },
    Boolean(openModal),
  );
  const stores = data?.stores ?? [];

  const { days, hours, minutes, seconds, expired } = useCountdown(expireAt);

  const showDays = days > 0;
  const showHours = showDays || hours > 0;
  const timerSegments = [
    ...(showDays ? [{ value: pad(days), label: t("day") }] : []),
    ...(showHours ? [{ value: pad(hours), label: t("hr") }] : []),
    { value: pad(minutes), label: t("min") },
    { value: pad(seconds), label: t("sec") },
  ];
  const tightTimer = isMobile && timerSegments.length > 2;

  const title = `${
    happyHour?.discount ? `${happyHour.discount}${t("% OFF")}! ` : ""
  }${happyHour?.title ?? t("Happy Hour")}`;

  return (
    <CustomModal
      openModal={Boolean(openModal)}
      handleClose={handleClose}
      closeButton
      maxWidth="900px"
    >
      <Stack
        sx={{
          gap: { xs: "20px", md: "32px" },
          px: { xs: "16px", md: "32px" },
          pt: { xs: "8px", md: "8px" },
          pb: { xs: "20px", md: "32px" },
        }}
      >
        <OfferHeader>
          <Cover>
            <NextImage
              src={happyHour?.cover_image_full_url}
              alt={happyHour?.title ?? t("Happy Hour")}
              width="418"
              height="178"
              objectFit="cover"
            />
          </Cover>
          <HeaderContent>
            <Stack sx={{ gap: { xs: "4px", md: "8px" } }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "20px", md: "24px" },
                  letterSpacing: "-1.2px",
                  lineHeight: 1.1,
                  color: "neutral.1050",
                }}
              >
                {title}
              </Typography>
              {!!happyHour?.short_description && (
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: { xs: "12px", md: "16px" },
                    lineHeight: 1.3,
                    color: "neutral.500",
                  }}
                >
                  {happyHour.short_description}
                </Typography>
              )}
            </Stack>

            {!expired && (
              <TimerRow>
                {timerSegments.map((segment, index) => (
                  <Fragment key={segment.label}>
                    {index > 0 && (
                      <ColonSeparator tight={tightTimer}>:</ColonSeparator>
                    )}
                    <TimerBox tight={tightTimer}>
                      <TimerNumber tight={tightTimer}>
                        {segment.value}
                      </TimerNumber>
                      <TimerLabel tight={tightTimer}>
                        {segment.label}
                      </TimerLabel>
                    </TimerBox>
                  </Fragment>
                ))}
              </TimerRow>
            )}
          </HeaderContent>
        </OfferHeader>

        <Stack sx={{ gap: "16px" }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "18px",
              lineHeight: 1.3,
              color: "neutral.1050",
            }}
          >
            {t("Explore Restaurants")}
          </Typography>

          {isLoading ? (
            <Grid container spacing={{ xs: 1.5, md: 3 }}>
              {[...Array(isMobile ? 2 : 3)].map((_, i) => (
                <Grid key={i} item xs={12} sm={6} md={4}>
                  <StoreShimmer />
                </Grid>
              ))}
            </Grid>
          ) : stores.length === 0 ? (
            <Typography
              align="center"
              sx={{ py: "24px", fontSize: "14px", color: "neutral.500" }}
            >
              {t("No stores are running this offer right now.")}
            </Typography>
          ) : (
            <Grid container spacing={{ xs: 1.5, md: 3 }}>
              {stores.map((store) => {
                // /happy-hour/stores never returns a bare `discount` key —
                // NewStoreCard reads item.discount.{discount,discount_type},
                // but this row carries `active_discount` (a number: what's
                // actually charged) and `store_discount` (the vendor's own
                // standing rate, not what's billed during the window).
                //
                // NewStoreCard also reads `rating_count`; this row's field
                // is named `reviews_count`.
                const cardItem = {
                  ...store,
                  active: store?.active ?? true,
                  rating_count: store?.rating_count ?? store?.reviews_count,
                  discount:
                    store?.active_discount > 0
                      ? {
                          discount: store.active_discount,
                          discount_type: store?.store_discount?.discount_type ?? "percent",
                        }
                      : store?.discount,
                };
                return (
                  <Grid key={store?.id} item xs={12} sm={6} md={4}>
                    <Box sx={{ "& > *": { width: "100% !important" } }}>
                      <NewStoreCard
                        variant="normal"
                        item={cardItem}
                        imageUrl={store?.cover_photo_full_url ?? store?.logo_full_url}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
      </Stack>
    </CustomModal>
  );
};

export default HappyHourViewModal;
