import { Box, Stack, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import useGetBogoHome from "api-manage/hooks/react-query/bogo/useGetBogoHome";
import useGetBogoStoreOffers from "api-manage/hooks/react-query/bogo/useGetBogoStoreOffers";
import { navigateToBogoList } from "helper-functions/navigateToBogoList";
import BogoIcon from "./BogoIcon";

const BannerShell = styled(Stack)(({ theme }) => ({
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.bogoBanner.bg,
  gap: "8px",
  borderRadius: "16px",
  padding: "16px 16px 16px 20px",
  [theme.breakpoints.down("sm")]: {
    padding: "12px 12px 12px 16px",
    borderRadius: "12px",
  },
}));

// `storeId` (store-details page): gates on this store's own BOGO offers
// instead of the home `is_live` flag. `onClick`: overrides the default
// navigation to /bogo-list — e.g. the store-details page opens its own
// offers drawer instead.
const BogoBanner = ({ storeId, onClick } = {}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: bogoHome } = useGetBogoHome(!storeId);
  const { data: bogoStoreOffers } = useGetBogoStoreOffers(storeId, {}, !!storeId);

  const handleClick = onClick || navigateToBogoList;

  const isLive = storeId
    ? (bogoStoreOffers?.data?.length ?? 0) > 0
    : !!bogoHome?.is_live;

  if (!isLive) return null;

  return (
    <BannerShell role="button" tabIndex={0} onClick={handleClick}>
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: "32px", md: "40px" },
          height: { xs: "32px", md: "40px" },
          "& svg": { width: "100%", height: "100%" },
        }}
      >
        <BogoIcon />
      </Box>

      <Stack sx={{ flex: 1, minWidth: 0, gap: "4px" }}>
        <Typography
          component="h3"
          sx={{
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.54px",
            color: "neutral.1050",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {t("Hurry Up! BOGO Offer Is Live")}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "12px", md: "14px" },
            lineHeight: 1.3,
            color: "neutral.500",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {t("Buy more and enjoy exclusive free items.")}
        </Typography>
      </Stack>

      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: 32, md: 44 },
          height: { xs: 32, md: 44 },
        }}
      >
        <i
          className="fi fi-rs-arrow-small-right"
          style={{
            fontSize: "20px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.neutral[1050],
            transform: theme.direction === "rtl" ? "scaleX(-1)" : "none",
          }}
        />
      </Box>
    </BannerShell>
  );
};

export default BogoBanner;
