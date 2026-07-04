import { alpha, Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import useGetTopOffer from "api-manage/hooks/react-query/useGetTopOffer";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const TopOfferNotifyBanner = ({ title, subtitle, onClick, icon, bannerSx }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const { data: topOfferData } = useGetTopOffer();

  if (!topOfferData || topOfferData.discount <= 0) return null;

  const moduleType = getCurrentModuleType();
  const discountLabel =
    topOfferData.discount_type === "percent"
      ? `${topOfferData.discount}%`
      : getAmountWithSign(topOfferData.discount, false);

  const defaultTitle =
    moduleType === "grocery"
      ? t("Get Groceries Up to {{discount}} Off?", { discount: discountLabel })
      : moduleType === "ecommerce"
      ? t("Shop & Save Up to {{discount}} Off?", { discount: discountLabel })
      : t("Get Launch Up to {{discount}} Off?", { discount: discountLabel });

  const defaultSubtitle =
    moduleType === "grocery"
      ? t("Fresh deals on everyday essentials, order now")
      : moduleType === "ecommerce"
      ? t("Limited time offer on top products, grab yours now")
      : t("Don't miss out, order your favorites now");

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    const moduleParam =
      typeof router.query.module === "string"
        ? router.query.module
        : getCurrentModuleType() || "food";
    router.push(`/home/offers?module=${moduleParam}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: "100%",
        backgroundColor: theme.palette.mode === "dark"
          ? alpha(theme.palette.warning.main, 0.15)
          : theme.palette.warning.light,
        border: `1px solid ${theme.palette.customColor.tagBg}`,
        borderRadius: { xs: "12px", sm: "16px" },
        padding: { xs: "12px", sm: "16px" },
        display: "flex",
        alignItems: "center",
        gap: { xs: "6px", sm: "8px" },
        overflow: "hidden",
        cursor: "pointer",
        ...bannerSx,
      }}
    >
      {/* Icon */}
      <Box sx={{ flexShrink: 0, display: "flex" }}>{icon ?? offerIcon()}</Box>

      {/* Text */}
      <Stack
        sx={{ flex: 1, minWidth: 0, gap: "4px", px: { xs: "4px", sm: "8px" } }}
      >
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
            fontWeight: 700,
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-0.54px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: { xs: "normal", sm: "nowrap" },
            display: { xs: "-webkit-box", sm: "block" },
            WebkitLineClamp: { xs: 2 },
            WebkitBoxOrient: "vertical",
          }}
        >
          {title || defaultTitle}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "13px", md: "14px" },
            fontWeight: 400,
            color: "neutral.500",
            lineHeight: 1.3,
            display: { sm: "block" },
          }}
        >
          {subtitle || defaultSubtitle}
        </Typography>
      </Stack>

      {/* Arrow button */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        sx={{
          width: { xs: 36, sm: 44 },
          height: { xs: 36, sm: 44 },
          borderRadius: { xs: "10px", sm: "16px" },
          flexShrink: 0,
          color: "neutral.1050",
        }}
      >
        <i
          className="fi fi-rs-arrow-small-right"
          style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
        />
      </IconButton>
    </Box>
  );
};

function offerIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.7701 12.0447C24.6937 9.78602 22.9016 7.76391 22.9016 4.70904C22.9016 2.97148 23.2476 1.28644 23.2507 1.26998C23.3156 0.958922 23.2374 0.635555 23.0365 0.389391C22.8367 0.143156 22.536 0 22.2188 0C20.4338 0 15.3385 1.32145 15.3385 7.19227C15.3385 10.9444 14.5784 12.1704 14.2509 12.4938C14.0665 12.6771 13.8203 12.7801 13.6205 12.7502C12.6493 12.7389 12.4659 11.3484 12.4597 11.2958C12.4206 10.9374 12.2002 10.6233 11.8757 10.4647C11.5513 10.304 11.1712 10.3215 10.8612 10.511C6.74655 13.0253 4.28906 17.4016 4.28906 22.2188C4.28906 29.7787 10.44 36 18 36C25.56 36 31.7109 29.7787 31.7109 22.2188C31.7109 17.4243 29.0855 14.5661 26.7701 12.0447Z"
        fill="url(#paint0_linear_2042_22947)"
      />
      <path
        d="M16.9453 20.1094C16.9453 18.3646 15.526 16.9453 13.7812 16.9453C12.0365 16.9453 10.6172 18.3646 10.6172 20.1094C10.6172 21.8541 12.0365 23.2734 13.7812 23.2734C15.526 23.2734 16.9453 21.8541 16.9453 20.1094ZM12.7266 20.1094C12.7266 19.5275 13.1993 19.0547 13.7812 19.0547C14.3632 19.0547 14.8359 19.5275 14.8359 20.1094C14.8359 20.6913 14.3632 21.1641 13.7812 21.1641C13.1993 21.1641 12.7266 20.6913 12.7266 20.1094ZM22.2188 23.2734C20.474 23.2734 19.0547 24.6928 19.0547 26.4375C19.0547 28.1822 20.474 29.6016 22.2188 29.6016C23.9635 29.6016 25.3828 28.1822 25.3828 26.4375C25.3828 24.6928 23.9636 23.2734 22.2188 23.2734ZM22.2188 27.4922C21.6368 27.4922 21.1641 27.0194 21.1641 26.4375C21.1641 25.8556 21.6368 25.3828 22.2188 25.3828C22.8007 25.3828 23.2734 25.8556 23.2734 26.4375C23.2734 27.0194 22.8007 27.4922 22.2188 27.4922ZM22.8779 17.176C22.4227 16.8135 21.7604 16.8897 21.3948 17.3408L12.9573 27.8877C12.5937 28.343 12.6679 29.0062 13.1221 29.3709C13.5754 29.733 14.2381 29.6618 14.6052 29.2061L23.0427 18.6592C23.4063 18.2039 23.3321 17.5406 22.8779 17.176Z"
        fill="url(#paint1_linear_2042_22947)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2042_22947"
          x1="18"
          y1="36"
          x2="18"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FD5900" />
          <stop offset="1" stopColor="#FFDE00" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2042_22947"
          x1="18"
          y1="29.6016"
          x2="18"
          y2="16.9453"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE59A" />
          <stop offset="1" stopColor="#FFFFD5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
export default TopOfferNotifyBanner;
