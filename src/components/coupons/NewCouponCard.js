import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import moment from "moment/moment";
import toast from "react-hot-toast";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";

const NewCouponCard = ({ coupon, setCopy, copy, onApply }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const cardBg = isDark ? "#423737" : "#fee9e7";
  const titleColor = isDark ? theme.palette.neutral[1050] : "#1e1e1e";
  const discountColor = isDark ? "#90CAF9" : "#183057";
  const dashedColor = isDark ? "rgba(255,255,255,0.15)" : "#ffffff";

  const isProCoupon = coupon?.coupon_type === "pro_customer";

  // Pro badge — reused before the code. Purple "premium" gradient that holds
  // up in both light and dark mode.
  const proBadge = (
    <Stack
      direction="row"
      alignItems="center"
      gap="4px"
      sx={{
        flexShrink: 0,
        height: "24px",
        px: "8px",
        borderRadius: "6px",
        backgroundColor: "primary.main",
        boxShadow: isDark
          ? "none"
          : `0px 2px 6px ${alpha(theme.palette.primary.main, 0.35)}`,
      }}
    >
      <i
        className="fi fi-sr-crown"
        style={{
          fontSize: "12px",
          lineHeight: 1,
          display: "flex",
          color: "#FFD54F",
        }}
      />
      <Typography
        sx={{
          fontSize: "11px",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "0.4px",
          color: "#fff",
          textTransform: "uppercase",
        }}
      >
        {t("Pro")}
      </Typography>
    </Stack>
  );

  const discountLabel =
    coupon?.coupon_type === "free_delivery"
      ? t("Free Delivery")
      : coupon?.discount_type === "percent"
      ? `${coupon?.discount}% ${t("OFF")}`
      : `${getAmountWithSign(coupon?.discount)} ${t("OFF")}`;

  const handleCopy = () => {
    const code = coupon?.code ?? "";
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopy(code);
        toast(() => (
          <span>
            {t("Code")}
            <b style={{ marginLeft: "4px", marginRight: "4px" }}>{code}</b>
            {t("has been copied")}
          </span>
        ));
      })
      .catch((err) => {
        console.error("Failed to copy code:", err);
      });
  };

  return (
    <Box
      sx={{
        backgroundColor: cardBg,
        border: "2px solid",
        borderColor: "background.paper",
        borderRadius: "12px",
        overflow: "hidden",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Top: icon + title + discount */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap="10px"
        sx={{ px: "16px", pt: "12px", pb: "4px" }}
      >
        {/* Left: icon + title */}
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{ flex: 1, minWidth: 0 }}
        >
          <Box
            sx={{
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <i
              className="fi fi-sr-ticket"
              style={{
                fontSize: "20px",
                lineHeight: 1,
                display: "flex",
                color: "#e53935",
                transform: "rotate(90deg)",
              }}
            />
          </Box>
          <Typography
            noWrap
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.42px",
              color: titleColor,
              textTransform: "capitalize",
              flex: 1,
              minWidth: 0,
            }}
          >
            {coupon?.title}
          </Typography>
        </Stack>
        {/* Right: discount */}
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.48px",
            color: discountColor,
            textAlign: "right",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {discountLabel}
        </Typography>
      </Stack>

      {/* Dashed divider with cutout circles */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Left cutout: justify-end so right half of circle peeks in */}
        <Box
          sx={{
            width: "10px",
            height: "20px",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Box
            sx={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "background.paper",
              border: "none",
              flexShrink: 0,
            }}
          />
        </Box>
        {/* Dashed line */}
        <Box sx={{ flex: 1, minWidth: 0, position: "relative", height: "2px" }}>
          <Box
            sx={{
              position: "absolute",
              inset: "-1px 0",
              borderTop: `2px dashed ${dashedColor}`,
            }}
          />
        </Box>
        {/* Right cutout: flex-start so left half of circle peeks in */}
        <Box
          sx={{
            width: "10px",
            height: "20px",
            overflow: "hidden",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Box
            sx={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "background.paper",
              border: "none",
              flexShrink: 0,
            }}
          />
        </Box>
      </Box>

      {/* Description */}
      <Box
        sx={{
          px: "16px",
          pt: "8px",
          pb: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: 1.3,
            letterSpacing: 0,
            color: "text.secondary",
          }}
        >
          {coupon?.coupon_type === "store_wise" && (
            <>
              {t("On")} {coupon?.data}
              {coupon?.store && (
                <VerifiedStoreBadge
                  verified={coupon?.store?.verified_seller}
                  fontSize="10px"
                />
              )}
            </>
          )}
          {coupon?.coupon_type === "zone_wise" && (
            <>
              {t("Only for some specific zones")}
              {coupon?.store && (
                <>
                  {" "}
                  <VerifiedStoreBadge
                    verified={coupon?.store?.verified_seller}
                    fontSize="10px"
                  />
                </>
              )}
            </>
          )}
          {coupon?.coupon_type === "free_delivery" && (
            <>
              {t("Free delivery")}
              {coupon?.store && (
                <>
                  {" "}
                  {coupon?.store?.name}
                  <VerifiedStoreBadge
                    verified={coupon?.store?.verified_seller}
                    fontSize="10px"
                  />
                </>
              )}
            </>
          )}
          {coupon?.coupon_type === "first_order" && (
            <>
              {t("Only for First Order")}
              {coupon?.store && (
                <>
                  {" "}
                  {coupon?.store?.name}
                  <VerifiedStoreBadge
                    verified={coupon?.store?.verified_seller}
                    fontSize="10px"
                  />
                </>
              )}
            </>
          )}
          {coupon?.coupon_type === "pro_customer" && (
            <>
              {t("Only for Pro members")}
              {coupon?.store && (
                <>
                  {" "}
                  {coupon?.store?.name}
                  <VerifiedStoreBadge
                    verified={coupon?.store?.verified_seller}
                    fontSize="10px"
                  />
                </>
              )}
            </>
          )}
          {coupon?.coupon_type === "default" && <>{t("Default")}</>}
          {coupon?.min_purchase > 0 && (
            <>
              {". "}
              {t("Minimum order")} {getAmountWithSign(coupon?.min_purchase)}
            </>
          )}
          {(moment(coupon?.start_date).isValid() ||
            moment(coupon?.end_date).isValid()) && (
            <>
              {". "}
              Validity: {moment(coupon?.start_date).format("DD MMM, YYYY")}{" "}
              {t("to")} {moment(coupon?.end_date).format("DD MMM, YYYY")}
            </>
          )}
        </Typography>
      </Box>

      {/* Bottom: code + copy  */}
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{ px: "16px", pt: 0, pb: "12px" }}
      >
        {/* Pro badge sits before the code for pro-only coupons */}
        {isProCoupon && proBadge}
        {/* Coupon code — truncates if too long */}
        <Typography
          noWrap
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.54px",
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {coupon?.code}
        </Typography>
        {/* Copy icon button: 28×28 circle */}
        <Box
          onClick={handleCopy}
          sx={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
            cursor: "pointer",
            color: copy === coupon?.code ? "#039d55" : titleColor,
          }}
        >
          <i
            className="fi fi-rr-duplicate"
            style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default NewCouponCard;
