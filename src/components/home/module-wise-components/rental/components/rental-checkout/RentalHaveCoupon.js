import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  InputBase,
  Modal,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CouponApi } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/coupon/useApplyCoupon";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { setCouponInfo, setCouponType } from "redux/slices/profileInfo";
import { coupon_minimum } from "utils/toasterMessages";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useGetCouponLists } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/coupon/useCouponsLists";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const TICKET_BG = "#FEE9E7";
const TICKET_ACCENT = "#E04A3C";
const TICKET_DARK = "#183057";

const discountLabel = (coupon, t) => {
  if (!coupon) return "";
  if (coupon.discount_type === "percent") return `${coupon.discount}% OFF`;
  return `${getAmountWithSign(coupon.discount)} OFF`;
};

// Backend signals a Pro-only coupon either by `coupon_type === "pro_customer"`
// or by listing "pro_customer" / "pro" in the `customer_id` field (which can
// be an array or a JSON-stringified array — same shape as food coupons).
const isProCoupon = (coupon) => {
  if (!coupon) return false;
  if (coupon.coupon_type === "pro_customer") return true;
  const raw = coupon.customer_id;
  let ids = [];
  if (Array.isArray(raw)) ids = raw.map(String);
  else if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) ids = parsed.map(String);
    } catch {
      // ignore
    }
  }
  return ids.includes("pro_customer") || ids.includes("pro");
};

const TicketCard = ({
  title,
  description,
  badge,
  actionLabel,
  actionVariant,
  onAction,
  loading,
  theme,
  isPro,
}) => (
  <Box
    sx={{
      position: "relative",
      borderRadius: "12px",
      overflow: "hidden",
      backgroundColor: TICKET_BG,
    }}
  >
    {isPro && (
      <Box
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          height: "22px",
          px: "8px",
          borderRadius: "999px",
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.3px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      >
        <i
          className="fi fi-sr-crown"
          style={{
            fontSize: "12px",
            lineHeight: 1,
            display: "inline-flex",
            color: "#fff",
          }}
        />
      </Box>
    )}
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={{ xs: 1.5, md: 2 }}
      py={{ xs: 1.25, md: 1.5 }}
      gap={1}
    >
      <Stack direction="row" alignItems="center" gap={1.25} minWidth={0}>
        <LocalActivityRoundedIcon
          sx={{
            fontSize: 28,
            color: TICKET_ACCENT,
            transform: "rotate(-15deg)",
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: "13px", md: "14px" },
            color: TICKET_DARK,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
      </Stack>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "13px", md: "14px" },
          color: TICKET_DARK,
          whiteSpace: "nowrap",
          flexShrink: 0,
          pr: isPro ? 5 : 0,
        }}
      >
        {badge}
      </Typography>
    </Stack>

    <Box
      sx={{
        position: "relative",
        height: "0px",
        borderTop: `1px dashed ${alpha(TICKET_ACCENT, 0.4)}`,
        mx: { xs: 1.5, md: 2 },
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          top: "-10px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: theme.palette.background.paper,
        },
        "&::before": { left: "-26px" },
        "&::after": { right: "-26px" },
      }}
    />

    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={{ xs: 1.5, md: 2 }}
      py={{ xs: 1, md: 1.25 }}
      gap={1}
    >
      <Typography
        sx={{
          fontSize: { xs: "11px", md: "12px" },
          color: alpha(TICKET_DARK, 0.7),
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {description}
      </Typography>
      {actionLabel && (
        <Button
          onClick={onAction}
          variant="contained"
          disableElevation
          disabled={loading}
          sx={{
            flexShrink: 0,
            px: { xs: 2, md: 2.5 },
            py: { xs: 0.5, md: 0.75 },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "12px", md: "13px" },
            backgroundColor:
              actionVariant === "primary"
                ? theme.palette.primary.main
                : TICKET_ACCENT,
            color: "#fff",
            boxShadow: "none",
            "&:hover": {
              backgroundColor:
                actionVariant === "primary"
                  ? theme.palette.primary.dark
                  : "#C13D31",
              boxShadow: "none",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            actionLabel
          )}
        </Button>
      )}
    </Stack>
  </Box>
);

const RentalHaveCoupon = ({
  provider_id,
  tripCost,
  setCouponDiscount,
  appliedCoupon,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { couponInfo, profileInfo } = useSelector((state) => state.profileInfo);
  const customerId = profileInfo?.id;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [pendingCode, setPendingCode] = useState(null);

  // Pull the available rental coupons so the user can tap to apply
  // instead of typing the code every time.
  const {
    data: couponListData,
    isLoading: listLoading,
    refetch: refetchCouponList,
  } = useGetCouponLists(provider_id, customerId);
  const rawCouponList =
    couponListData?.coupons ?? couponListData?.data ?? couponListData ?? [];
  // Only show coupons that match this provider (or are global — provider_id
  // missing / null).
  const couponList = Array.isArray(rawCouponList)
    ? rawCouponList.filter((c) => {
        const couponProviderId = c?.provider_id ?? c?.store_id;
        return (
          couponProviderId == null ||
          String(couponProviderId) === String(provider_id)
        );
      })
    : [];

  React.useEffect(() => {
    if (open) refetchCouponList();
  }, [open]);

  const handleSuccess = (response) => {
    setPendingCode(null);

    const apiErrors = response?.errors ?? response?.data?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      apiErrors.forEach((item) => {
        if (item?.message) {
          toast.error(item.message, { id: `coupon-${item?.code || "error"}` });
        }
      });
      return;
    }

    const data = response?.data;
    if (!data) return;

    const triggerApplied = () => {
      dispatch(setCouponInfo(data));
      dispatch(setCouponType(data.coupon_type));
      setCouponDiscount(data);
      toast.success(t("Coupon Applied"));
      setOpen(false);
      setSearchCode("");
    };

    if (Number.parseInt(data.min_purchase) <= Number.parseInt(tripCost)) {
      if (data.discount_type === "percent") {
        triggerApplied();
      } else if (data.discount && tripCost >= data.discount) {
        triggerApplied();
      } else {
        toast.error(t("Your total price must be more then coupon amount"));
      }
    } else {
      toast.error(
        `${t(coupon_minimum)} ${getAmountWithSign(data.min_purchase)}`
      );
    }
  };

  const { isLoading: applyLoading, refetch: applyRefetch } = useQuery(
    ["apply-coupon-rental", pendingCode],
    () => CouponApi.applyCoupon(pendingCode, provider_id),
    {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
      enabled: false,
      retry: 1,
    }
  );

  React.useEffect(() => {
    if (pendingCode) applyRefetch();
  }, [pendingCode]);

  const removeCoupon = () => {
    setCouponDiscount(null);
    dispatch(setCouponInfo(null));
  };

  const handleApply = (code) => {
    if (!code) {
      toast.error(t("Enter your coupon code"));
      return;
    }
    setPendingCode(code);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearchCode("");
  };

  const enterCodeNode = (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: isMobile ? "16px 16px 0 0" : "16px",
        p: { xs: 2, md: 3 },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={1}
        mb={2}
      >
        <Stack spacing={0.25} flex={1} minWidth={0}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "16px", md: "18px" },
              color: theme.palette.text.primary,
            }}
          >
            {t("Apply Coupon")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "13px" },
              color: theme.palette.text.secondary,
            }}
          >
            {t("Enter your promo code below.")}
          </Typography>
        </Stack>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Available coupons list */}
      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.4px",
            color: theme.palette.text.secondary,
            mb: 1,
          }}
        >
          {t("Available Coupons")}
        </Typography>
        {listLoading ? (
          <Stack alignItems="center" py={3}>
            <CircularProgress size={20} />
          </Stack>
        ) : couponList.length === 0 ? (
          <Typography
            textAlign="center"
            py={2}
            sx={{ color: theme.palette.text.secondary, fontSize: "13px" }}
          >
            {t("No available coupons.")}
          </Typography>
        ) : (
          <SimpleBar style={{ maxHeight: isMobile ? "55vh" : "360px" }}>
            <Stack spacing={1.25} sx={{ pr: 0.5 }}>
              {couponList.map((coupon) => (
                <TicketCard
                  key={coupon.id || coupon.code}
                  theme={theme}
                  title={coupon.title || coupon.code}
                  badge={discountLabel(coupon, t)}
                  isPro={isProCoupon(coupon)}
                  description={
                    coupon.min_purchase > 0
                      ? `${t("Minimum order")} ${getAmountWithSign(
                          coupon.min_purchase
                        )}.`
                      : t("Tap apply to redeem.")
                  }
                  actionLabel={t("Apply")}
                  actionVariant="primary"
                  onAction={() => handleApply(coupon.code)}
                  loading={applyLoading && pendingCode === coupon.code}
                />
              ))}
            </Stack>
          </SimpleBar>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.paper,
          borderRadius: { xs: "10px", md: "14px" },
          boxShadow: `0 1px 4px ${alpha("#000", 0.06)}`,
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Stack spacing={0.25} flex={1} minWidth={0}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "14px", md: "16px" },
                color: theme.palette.text.primary,
              }}
            >
              {t("Add Coupon")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "11px", md: "12px" },
                color: theme.palette.text.secondary,
              }}
            >
              {t("Enter a promo code to save on your trip")}
            </Typography>
          </Stack>
          <IconButton
            size="small"
            onClick={handleOpen}
            sx={{
              backgroundColor: alpha(
                theme.palette.neutral?.[400] || theme.palette.text.secondary,
                0.12
              ),
              borderRadius: "8px",
              padding: "6px",
              color: appliedCoupon
                ? theme.palette.primary.main
                : theme.palette.text.primary,
              flexShrink: 0,
              "&:hover": {
                backgroundColor: alpha(
                  theme.palette.neutral?.[400] || theme.palette.text.secondary,
                  0.18
                ),
              },
            }}
          >
            {appliedCoupon ? (
              <EditOutlinedIcon fontSize="small" />
            ) : (
              <AddIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>

        {appliedCoupon ? (
          <Box mt={{ xs: 1.5, md: 2 }}>
            <TicketCard
              theme={theme}
              title={appliedCoupon.title || appliedCoupon.code}
              badge={discountLabel(appliedCoupon, t)}
              description={
                couponInfo?.start_date || couponInfo?.end_date
                  ? t("Coupon applied to your trip.")
                  : t("Coupon applied to your trip.")
              }
              actionLabel={t("Cancel")}
              actionVariant="danger"
              onAction={removeCoupon}
            />
          </Box>
        ) : null}
      </Box>

      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: "16px 16px 0 0",
              backgroundColor: "transparent",
            },
          }}
        >
          {enterCodeNode}
        </Drawer>
      ) : (
        <Modal
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 480, outline: "none" }}>
            {enterCodeNode}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default RentalHaveCoupon;
