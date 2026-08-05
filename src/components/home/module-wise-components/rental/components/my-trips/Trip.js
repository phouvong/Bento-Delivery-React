import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CustomPaperBigCard } from "styled-components/CustomStyles.style";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { setDeliveryManInfoByDispatch } from "redux/slices/searchFilter";
import StatusBadge from "components/common/StatusBadge";
import CustomImageContainer from "components/CustomImageContainer";
import CustomFormatedDateTime from "components/date/CustomFormatedDateTime";

export const CustomPaper = styled(CustomPaperBigCard)(({ theme }) => ({
  padding: "10px",
  backgroundColor: "transparent",
  boxShadow: "none",
}));

const RUNNING_STATUSES = ["pending", "confirmed", "picked_up", "ongoing"];

const Trip = ({ order }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.configData);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const status = order?.trip_status ?? "";
  const isRunning = RUNNING_STATUSES.includes(status);

  // When this card is shown inside the orders rental tab, forward the rental
  // module id so the trip-status page's back button can return to that exact
  // list + tab. Resolve from the URL first, then fall back to the rental module.
  const rentalModuleId =
    router.query.orderTabModule ??
    modules?.find((m) => m.module_type === "rental")?.id;
  const cameFromOrders = router.query.page === "my-orders";
  const tripStatusTarget = {
    pathname: `/rental/trip-status/${order?.id}`,
    query:
      cameFromOrders && rentalModuleId
        ? { orderTabModule: rentalModuleId }
        : {},
  };

  const goToDetails = () => {
    router.push(tripStatusTarget);
  };

  const handleTrack = (e) => {
    e?.stopPropagation?.();
    if (order?.delivery_man) dispatch(setDeliveryManInfoByDispatch(order.delivery_man));
    router.push(tripStatusTarget);
  };

  const actionLabel = isRunning ? t("Track Order") : t("View Details");

  return (
    <Box
      onClick={goToDetails}
      sx={{
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: "2fr 2fr 1fr 1fr" },
        gridTemplateAreas: {
          xs: `"col1 col1" "col2 col2" "col3 col4"`,
          md: `"col1 col2 col3 col4"`,
        },
        gap: { xs: "10px", md: "16px" },
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Col 1: Provider image + Trip # + Status */}
      <Stack spacing={isMobile ? "4px" : "6px"} sx={{ minWidth: 0, gridArea: "col1" }}>
        <Stack direction="row" alignItems="center" gap="10px">
          <Box
            sx={{
              width: { xs: 40, md: 52 },
              height: { xs: 40, md: 52 },
              borderRadius: "8px",
              overflow: "hidden",
              flexShrink: 0,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.secondary",
            }}
          >
            <CustomImageContainer
              src={order?.provider?.logo_full_url}
              width="52px"
              height="52px"
              smWidth="40px"
              smHeight="40px"
              objectfit="cover"
            />
          </Box>
          <Stack spacing="4px" sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "18px" },
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.54px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {order?.provider?.name}
            </Typography>
            <Stack direction="row" alignItems="center" gap="8px" flexWrap="wrap">
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "neutral.500",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                }}
              >
                {t("Trip")} #{order?.id}
              </Typography>
              <StatusBadge
                status={status}
                label={status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* Col 2: Vehicles + date */}
      <Stack spacing="4px" sx={{ minWidth: 0, gridArea: "col2" }}>
        {order?.trip_type !== "rental" && (
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "14px" },
              fontWeight: 400,
              color: "neutral.500",
              lineHeight: 1.3,
            }}
          >
            {order?.quantity} {t("Vehicles")}
          </Typography>
        )}
        <Typography
          sx={{
            fontSize: { xs: "12px", md: "13px" },
            color: "neutral.500",
            lineHeight: 1.3,
          }}
        >
          <CustomFormatedDateTime date={order?.created_at} />
        </Typography>
      </Stack>

      {/* Col 3: Amount */}
      <Box
        sx={{
          minWidth: 0,
          gridArea: "col3",
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "flex-end" },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "18px", md: "20px" },
            fontWeight: 700,
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-0.6px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {getAmountWithSign(order?.trip_amount)}
        </Typography>
      </Box>

      {/* Col 4: Action button */}
      <Box
        sx={{
          gridArea: "col4",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            isRunning ? handleTrack(e) : goToDetails();
          }}
          sx={{
            height: "36px",
            px: "16px",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "-0.42px",
            flexShrink: 0,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {actionLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default Trip;
