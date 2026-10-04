import { styled } from "@mui/material/styles";
import { alpha, Button, Card, Chip, Typography, useTheme } from "@mui/material";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import { Stack } from "@mui/system";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useTranslation } from "react-i18next";
import { CouponStyle } from "styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import amountDiscount from "./assets/amountDiscount.png";
import freeDelivery from "./assets/freeDelivery.png";
import couponImagePercentage from "./assets/couponPer.png";
import CouponVector from "./CouponVector";
import CouponButtonComponent from "./CouponButtonComponent";
import moment from "moment/moment";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";

const StoreNameWithBadge = ({ store }) => (
  <>
    ({store?.name}
    <VerifiedStoreBadge verified={store?.verified_seller} fontSize="10px" />)
  </>
);

export const CouponButtonStyle = styled(Button)(({ theme }) => ({
  width: "111px",
  border: "1px  dotted",
  borderColor: theme.palette.primary.main,
  borderRadius: "5px",
  textAlign: "center",
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  padding: "5px 10px",
  fontSize: "12px",
  [theme.breakpoints.down("md")]: {
    fontSize: "11px",
    padding: "2px 5px",
  },
}));

const Coupon = (props) => {
  const { coupon, isLoading, setCopy, copy } = props;

  const { t } = useTranslation();
  const theme = useTheme();

  // Pro-customer coupon detection. Primary signal is `coupon_type` (sits
  // alongside "default", "first_order", "free_delivery", etc.). Backend also
  // ships `customer_id` as a JSON-stringified array — fall back to that in
  // case the type field is left as "default" but the audience is restricted.
  const parsedCustomerIds = (() => {
    const raw = coupon?.customer_id;
    if (Array.isArray(raw)) return raw.map(String);
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        return [];
      }
    }
    return [];
  })();
  const isProCoupon =
    coupon?.coupon_type === "pro_customer" ||
    parsedCustomerIds.includes("pro_customer") ||
    parsedCustomerIds.includes("pro");

  const couponType = (coupon) => {
    if (coupon?.coupon_type === "store_wise") {
      return (
        <>
          {t("On")} {coupon?.data}
        </>
      );
    }
    if (coupon?.coupon_type === "zone_wise") {
      return (
        <>
          {t("Only for some specific zones")}{" "}
          {coupon?.store && <StoreNameWithBadge store={coupon?.store} />}
        </>
      );
    }
    if (coupon?.coupon_type === "free_delivery") {
      return (
        <>
          {t("Free delivery")}{" "}
          {coupon?.store && <StoreNameWithBadge store={coupon?.store} />}
        </>
      );
    }
    if (coupon?.coupon_type === "first_order") {
      return (
        <>
          {t("Only for First Order")}{" "}
          {coupon?.store && <StoreNameWithBadge store={coupon?.store} />}
        </>
      );
    }
    if (coupon?.coupon_type === "pro_customer") {
      return (
        <>
          {t("Only for Pro members")}{" "}
          {coupon?.store && <StoreNameWithBadge store={coupon?.store} />}
        </>
      );
    }
    if (coupon?.coupon_type === "default") {
      return (
        <>
          {coupon?.coupon_type}{" "}
          {coupon?.store && <StoreNameWithBadge store={coupon?.store} />}
        </>
      );
    }
  };
  const imageHandler = () => {
    if (coupon?.coupon_type === "free_delivery") {
      return (
        <CustomImageContainer
          src={freeDelivery.src}
          width="30px"
          height="30px"
        />
      );
    } else {
      if (coupon?.discount_type === "percent") {
        return (
          <CustomImageContainer
            src={couponImagePercentage.src}
            width="30px"
            height="30px"
          />
        );
      } else {
        return (
          <CustomImageContainer
            src={amountDiscount.src}
            width="30px"
            height="30px"
          />
        );
      }
    }
  };

  return (
    <Card
      elevation={9}
      sx={{
        position: "relative",
        padding: ".5rem",
        boxShadow: `0px 2px 10px -3px ${(theme) =>
          alpha(theme.palette.primary.main, 0.1)}`,
        backgroundColor: theme.palette.neutral[100],
        backdropFilter: "blur(5px)",
      }}
    >
      {isProCoupon && (
        <Chip
          icon={
            <WorkspacePremiumRoundedIcon sx={{ fontSize: "14px !important" }} />
          }
          label={t("Pro")}
          size="small"
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            height: "20px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.3px",
            color: "#fff",
            backgroundColor: theme.palette.primary.main,
            "& .MuiChip-icon": { color: "#fff", ml: "4px" },
            "& .MuiChip-label": { px: "6px" },
          }}
        />
      )}
      <Stack alignItems="center" direction="row">
        <Stack alignItems="center" justifyContent="center" width="220px">
          {imageHandler()}
          <Typography
            fontWeight="bold"
            fontSize={{ xs: "14px", md: "18px" }}
            mt="8px"
          >
            {coupon?.coupon_type === "free_delivery"
              ? t("Free Delivery")
              : coupon?.discount_type === "percent"
              ? `${coupon?.discount} %`
              : getAmountWithSign(coupon?.discount)}
            {coupon?.coupon_type === "free_delivery" ? "" : t("Off")}
          </Typography>
          <Typography fontSize="10px" color={theme.palette.neutral[500]}>
            {couponType(coupon)}
          </Typography>
        </Stack>
        <CouponStyle>
          <CouponVector />
        </CouponStyle>
        <Stack
          spacing={0.5}
          padding="8px"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <CouponButtonComponent
            couponTitle={coupon.title}
            value={coupon?.code}
            setCopy={setCopy}
            copy={copy}
          />
          <Typography fontSize={{ xs: "10px", md: "12px" }} fontWeight="500">
            {moment(coupon?.start_date)?.format("DD MMM, YYYY")} {t("to")}{" "}
            {moment(coupon?.end_date)?.format("DD MMM, YYYY")}
          </Typography>
          {/*<Typography fontSize={{ xs: "8px", md: "10px" }}>*/}
          {/*  Available from 8:30 AM - 4:30 PM{" "}*/}
          {/*</Typography>*/}
        </Stack>
      </Stack>
    </Card>
  );
};

Coupon.propTypes = {};

export default Coupon;
