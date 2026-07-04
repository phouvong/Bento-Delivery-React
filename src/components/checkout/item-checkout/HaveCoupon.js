import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
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
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { CouponApi } from "api-manage/another-formated-api/couponApi";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { setCouponInfo, setCouponType } from "redux/slices/profileInfo";
import { coupon_minimum } from "utils/toasterMessages";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const TICKET_BG = "#FEE9E7";
const TICKET_ACCENT = "#E04A3C";
const TICKET_DARK = "#183057";

const formatRange = (start, end) => {
  const fmt = (d) => (d ? moment(d).format("MMM D, YYYY") : "");
  if (!start && !end) return "";
  if (start && end) return `${fmt(start)} - ${fmt(end)}`;
  return fmt(start || end);
};

const discountLabel = (coupon, t) => {
  if (!coupon) return "";
  if (coupon.coupon_type === "free_delivery") return t("Free Delivery");
  if (coupon.discount_type === "percent") return `${coupon.discount}% OFF`;
  return `${getAmountWithSign(coupon.discount)} OFF`;
};

// Pro-customer coupon detection. Primary signal is `coupon_type`; backend may
// also ship `customer_id` as a JSON-stringified array (e.g. "[\"all\"]" or
// "[\"pro_customer\"]"), so fall back to parsing that.
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
  isFirstOrder,
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
        <Stack direction="row" alignItems="center" gap={0.75} minWidth={0}>
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
          {isFirstOrder && (
            <Box
              component="span"
              sx={{
                flexShrink: 0,
                fontSize: "10px",
                fontWeight: 700,
                px: 0.75,
                py: "1px",
                borderRadius: "999px",
                backgroundColor: alpha(
                  theme.palette.warning?.main || "#F59E0B",
                  0.16
                ),
                color: theme.palette.warning?.dark || "#B45309",
                border: `1px solid ${alpha(
                  theme.palette.warning?.main || "#F59E0B",
                  0.35
                )}`,
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                lineHeight: 1.4,
              }}
            >
              First Order
            </Box>
          )}
        </Stack>
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

const HaveCoupon = (props) => {
  const {
    store_id,
    setCouponDiscount,
    totalAmount,
    deliveryFee,
    deliveryTip,
    setSwitchToWallet,
    payableAmount,
    min_order_amount,
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { couponInfo } = useSelector((state) => state.profileInfo);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [pendingCode, setPendingCode] = useState(null);

  let zoneId;
  if (typeof window !== "undefined") {
    zoneId = JSON.parse(localStorage.getItem("zoneid"));
  }

  const {
    data: couponListData,
    isLoading: listLoading,
    refetch: refetchList,
  } = useQuery("coupon-list", () => CouponApi.couponList(), {
    enabled: false,
    retry: 1,
  });

  useEffect(() => {
    if (open) refetchList();
  }, [open]);

  const rawCouponList = couponListData?.data || [];
  const couponList = rawCouponList.filter((coupon) => {
    const couponStoreId = coupon?.store_id;
    const couponType = coupon?.coupon_type;
    return (
      couponStoreId == null ||
      (couponType !== "store_wise" &&
        couponType !== "default" &&
        couponType !== "free_delivery") ||
      String(couponStoreId) === String(store_id)
    );
  });

  const handleSuccess = (response) => {
    const totalAmountOverall = totalAmount - deliveryFee - deliveryTip;
    setPendingCode(null);

    // Backend can answer 200 with `{ errors: [{ code, message }] }` when the
    // payload fails validation (missing code / store_id). Surface every
    // message and bail so we don't try to read a non-existent coupon body.
    const apiErrors = response?.errors ?? response?.data?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      apiErrors.forEach((item) => {
        if (item?.message) {
          toast.error(item.message, { id: `coupon-${item?.code || "error"}` });
        }
      });
      return;
    }

    const triggerApplied = (data) => {
      dispatch(setCouponInfo(data));
      toast.success(t("Coupon Applied"));
      dispatch(setCouponType(data.coupon_type));
      setCouponDiscount({ ...data, zoneId });
      setOpen(false);
      setSearchCode("");
    };
    if (
      Number.parseInt(response?.data?.min_purchase) <=
      Number.parseInt(totalAmountOverall)
    ) {
      if (response?.data?.coupon_type === "free_delivery") {
        triggerApplied(response.data);
      } else if (response?.data?.discount_type === "percent") {
        triggerApplied(response.data);
      } else {
        if (
          response?.data?.discount &&
          payableAmount >= response?.data?.discount
        ) {
          triggerApplied(response.data);
        } else {
          toast.error(t("Your total price must be more then coupon amount"));
        }
      }
    } else {
      toast.error(
        `${t(coupon_minimum)} ${getAmountWithSign(
          response?.data?.min_purchase
        )}`
      );
    }
  };

  const { isLoading: applyLoading, refetch: applyRefetch } = useQuery(
    ["apply-coupon", pendingCode],
    () => CouponApi.applyCoupon(pendingCode, store_id),
    {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
      enabled: false,
      retry: 1,
    }
  );

  useEffect(() => {
    if (pendingCode) applyRefetch();
  }, [pendingCode]);

  useEffect(() => {
    return () => {
      dispatch(setCouponInfo(null));
    };
  }, []);

  const removeCoupon = () => {
    setCouponDiscount(null);
    if (typeof window !== "undefined") localStorage.removeItem("coupon");
    dispatch(setCouponInfo(null));
    setSwitchToWallet?.(false);
  };

  const handleApply = (code) => {
    if (!code) return;
    setPendingCode(code);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearchCode("");
  };

  const couponListNode = (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: isMobile ? "16px 16px 0 0" : "16px",
        p: { xs: 2, md: 3 },
        maxHeight: { xs: "85vh", md: "80vh" },
        overflowY: "auto",
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
            {t("Available Coupons")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "13px" },
              color: theme.palette.text.secondary,
            }}
          >
            {t("Tap a coupon to apply, or enter a code below.")}
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

      {listLoading ? (
        <Stack alignItems="center" py={4}>
          <CircularProgress size={24} />
        </Stack>
      ) : couponList.length === 0 ? (
        <Typography
          textAlign="center"
          py={4}
          sx={{ color: theme.palette.text.secondary, fontSize: "13px" }}
        >
          {t("No available coupons.")}
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {couponList.map((coupon) => (
            <TicketCard
              key={coupon.id || coupon.code}
              theme={theme}
              title={coupon.title || coupon.code}
              badge={discountLabel(coupon, t)}
              isPro={isProCoupon(coupon)}
              isFirstOrder={coupon?.coupon_type === "first_order"}
              description={
                coupon.start_date || coupon.end_date
                  ? `${t("Valid from")} ${formatRange(
                      coupon.start_date,
                      coupon.end_date
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
      )}
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
              {t("To save more use available coupons")}
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
              color: couponInfo
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
            {couponInfo ? (
              <EditOutlinedIcon fontSize="small" />
            ) : (
              <AddIcon fontSize="small" />
            )}
          </IconButton>
        </Stack>

        {couponInfo && (
          <Box mt={{ xs: 1.5, md: 2 }}>
            <TicketCard
              theme={theme}
              title={couponInfo.title || couponInfo.code}
              badge={discountLabel(couponInfo, t)}
              isPro={isProCoupon(couponInfo)}
              isFirstOrder={couponInfo?.coupon_type === "first_order"}
              description={
                couponInfo.start_date || couponInfo.end_date
                  ? `${t("Valid from")} ${formatRange(
                      couponInfo.start_date,
                      couponInfo.end_date
                    )}.`
                  : t("Coupon applied to your order.")
              }
              actionLabel={t("Cancel")}
              actionVariant="danger"
              onAction={removeCoupon}
            />
          </Box>
        )}
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
          {couponListNode}
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
          <Box sx={{ width: "100%", maxWidth: 600, outline: "none" }}>
            {couponListNode}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default HaveCoupon;
