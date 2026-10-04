import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/system";
import React from "react";
import { t } from "i18next";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { toast } from "react-hot-toast";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { ReadMore } from "../../../ReadMore";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const formatUnderscoreText = (value) =>
  (value === null || value === undefined ? "" : String(value)).replaceAll(
    "_",
    " "
  );

const isCopyableLabel = (label) => {
  if (!label) return false;
  const n = String(label).toLowerCase();
  return (
    /\btransaction\b/.test(n) ||
    /\btxn\b/.test(n) ||
    /\btrxn\b/.test(n) ||
    /\breference\b/.test(n) ||
    /\bref\b/.test(n) ||
    /\bid\b/.test(n)
  );
};

const statusPalette = (status, theme) => {
  switch (status) {
    case "verified":
      return {
        bg: alpha(theme.palette.success.main, 0.12),
        color: theme.palette.success.main,
      };
    case "denied":
      return {
        bg: alpha(theme.palette.error.main, 0.12),
        color: theme.palette.error.main,
      };
    case "unpaid":
      return {
        bg: alpha(theme.palette.info.main, 0.12),
        color: theme.palette.info.main,
      };
    default:
      return {
        bg: alpha(theme.palette.warning.main, 0.16),
        color: theme.palette.warning.main,
      };
  }
};

const FieldStack = ({ entries, withCopy, onCopy, theme }) => (
  <Stack spacing={1.25}>
    {entries.map((entry, idx) => {
      const showCopy = withCopy && isCopyableLabel(entry.label) && entry.value;
      return (
        <Stack key={idx} spacing={0.25}>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.3px",
              textTransform: "uppercase",
              color:
                theme.palette.neutral?.[500] || theme.palette.text.secondary,
            }}
          >
            {entry.label}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            sx={{ minWidth: 0 }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: theme.palette.text.primary,
                wordBreak: "break-word",
                flex: 1,
                minWidth: 0,
                textTransform: "capitalize",
              }}
            >
              {entry.value || "—"}
            </Typography>
            {showCopy && (
              <Tooltip title={t("Copy")} arrow>
                <IconButton
                  size="small"
                  onClick={() => onCopy(entry.value)}
                  sx={{
                    p: "2px",
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ContentCopyRoundedIcon sx={{ fontSize: "14px" }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      );
    })}
  </Stack>
);

const OfflineOrderDetails = ({ trackOrderData, setOpenOfflineModal }) => {
  const theme = useTheme();

  const offlinePayment = trackOrderData?.offline_payment;
  const status = offlinePayment?.data?.status;
  const methodName = offlinePayment?.data?.method_name;
  const orderAmount = trackOrderData?.order_amount;
  const showEdit =
    status !== "verified" && trackOrderData?.order_status === "pending";

  const palette = statusPalette(status, theme);

  const sellerEntries =
    offlinePayment?.method_fields?.map((item) => ({
      label: formatUnderscoreText(item?.input_name),
      value: formatUnderscoreText(item?.input_data),
    })) || [];

  const customerEntries =
    offlinePayment?.input?.map((item) => ({
      label: formatUnderscoreText(item?.user_input),
      value: formatUnderscoreText(item?.user_data),
    })) || [];

  const copy = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(String(value));
      toast.success(t("Copied"));
    } catch {
      toast.error(t("Could not copy"));
    }
  };

  return (
    <CustomStackFullWidth
      mt="16px"
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${alpha(
          theme.palette.neutral?.[400] || "#000",
          0.18
        )}`,
        borderRadius: "14px",
        p: { xs: 2, md: 2.5 },
        gap: 2,
      }}
    >
      {/* Amount hero */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={1.5}
      >
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              color:
                theme.palette.neutral?.[500] || theme.palette.text.secondary,
            }}
          >
            {t("Amount Due")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "20px", md: "24px" },
              fontWeight: 800,
              color: theme.palette.primary.main,
              lineHeight: 1.1,
            }}
          >
            {orderAmount != null ? getAmountWithSign(orderAmount) : "—"}
          </Typography>
          {methodName && (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color:
                  theme.palette.neutral?.[500] || theme.palette.text.secondary,
                textTransform: "capitalize",
              }}
            >
              {t("via")} {methodName}
            </Typography>
          )}
        </Stack>
        {status && (
          <Box
            sx={{
              flexShrink: 0,
              px: 1.25,
              py: 0.5,
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "capitalize",
              backgroundColor: palette.bg,
              color: palette.color,
              border: `1px solid ${alpha(palette.color, 0.25)}`,
              lineHeight: 1.4,
            }}
          >
            {formatUnderscoreText(status)}
          </Box>
        )}
      </Stack>

      <Divider sx={{ borderColor: alpha("#000", 0.06) }} />

      {/* Seller / You split */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color:
                  theme.palette.neutral?.[500] || theme.palette.text.secondary,
              }}
            >
              {t("Send To")}
            </Typography>
            {sellerEntries.length > 0 ? (
              <FieldStack entries={sellerEntries} theme={theme} />
            ) : (
              <Typography
                sx={{
                  fontSize: "12px",
                  color:
                    theme.palette.neutral?.[500] ||
                    theme.palette.text.secondary,
                }}
              >
                {t("No seller info provided.")}
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={1.25}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color:
                    theme.palette.neutral?.[500] ||
                    theme.palette.text.secondary,
                }}
              >
                {t("You Sent")}
              </Typography>
              {showEdit && (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.5}
                  onClick={() => setOpenOfflineModal(true)}
                  sx={{
                    cursor: "pointer",
                    color: theme.palette.primary.main,
                    "&:hover": { opacity: 0.85 },
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: "14px" }} />
                  <Typography sx={{ fontSize: "11px", fontWeight: 700 }}>
                    {t("Edit")}
                  </Typography>
                </Stack>
              )}
            </Stack>
            {customerEntries.length > 0 ? (
              <FieldStack
                entries={customerEntries}
                withCopy
                onCopy={copy}
                theme={theme}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: "12px",
                  color:
                    theme.palette.neutral?.[500] ||
                    theme.palette.text.secondary,
                }}
              >
                {t("No payment info submitted.")}
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Note */}
      {offlinePayment?.data?.customer_note && (
        <>
          <Divider sx={{ borderColor: alpha("#000", 0.06) }} />
          <Stack
            spacing={0.5}
            sx={{
              p: 1.25,
              borderRadius: "10px",
              backgroundColor: alpha(
                theme.palette.neutral?.[400] || "#000",
                0.05
              ),
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color:
                  theme.palette.neutral?.[500] || theme.palette.text.secondary,
              }}
            >
              {t("Note")}
            </Typography>
            <Typography
              sx={{
                fontSize: "12.5px",
                color: theme.palette.text.primary,
                overflowWrap: "break-word",
                lineHeight: 1.55,
              }}
            >
              <ReadMore limits="120">
                {offlinePayment.data.customer_note}
              </ReadMore>
            </Typography>
          </Stack>
        </>
      )}
    </CustomStackFullWidth>
  );
};

export default OfflineOrderDetails;
