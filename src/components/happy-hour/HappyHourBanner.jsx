import { Box, Stack, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useCountdown, { pad } from "api-manage/hooks/custom-hooks/useCountdown";
import useHappyHourActive from "api-manage/hooks/custom-hooks/useHappyHourActive";
import HappyHourIcon from "./HappyHourIcon";

const HappyHourViewModal = dynamic(() => import("./HappyHourViewModal"));

const BannerShell = styled(Stack, {
  shouldForwardProp: (prop) => prop !== "compact",
})(({ theme, compact }) => ({
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.happyHourBanner.bg,
  gap: "8px",
  ...(compact
    ? {
        borderRadius: "16px 16px 0 0",
        padding: "12px 12px 12px 16px",
      }
    : {
        borderRadius: "16px",
        padding: "16px 16px 16px 20px",
        [theme.breakpoints.down("sm")]: {
          padding: "12px 12px 12px 16px",
          borderRadius: "12px",
        },
      }),
}));

const HappyHourBanner = ({ compact = false, onActiveChange }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isActive, happyHour, expireAt } = useHappyHourActive();
  const [openModal, setOpenModal] = useState(false);

  const { days, hours, minutes, seconds, expired } = useCountdown(expireAt);

  const isShown = isActive && !expired;
  useEffect(() => {
    onActiveChange?.(isShown);
    return () => onActiveChange?.(false);
  }, [isShown, onActiveChange]);

  if (!isShown) return null;

  const bannerTitle = `${
    happyHour?.discount ? `${happyHour.discount}${t("% OFF")}! ` : ""
  }${happyHour?.title ?? t("Happy Hour")}`;

  // Leading zero units collapse — a day only shows once >0, an hour only once
  // a day or hour is >0; minutes/seconds always show.
  const showDays = days > 0;
  const showHours = showDays || hours > 0;
  const segments = [
    ...(showDays ? [pad(days)] : []),
    ...(showHours ? [pad(hours)] : []),
    pad(minutes),
    pad(seconds),
  ];
  const tight = segments.length > 3;

  // Fixed (not min-) width + tabular-nums so a digit changing width
  // (e.g. 9 -> 10) never reflows the box or shifts sibling segments.
  const timerNumberSx = {
    width: { xs: tight ? "24px" : "28px", md: tight ? "30px" : "36px" },
    flexShrink: 0,
    textAlign: "center",
    fontSize: { xs: tight ? "13px" : "15px", md: tight ? "16px" : "18px" },
    fontWeight: 700,
    letterSpacing: "-0.48px",
    lineHeight: 1.1,
    padding: { xs: tight ? "4px" : "6px", md: "8px" },
    backgroundColor: "happyHourBanner.timerBg",
    borderRadius: "6px",
    // timerBg is solid red in both themes, so the digits stay white in both —
    // error.contrastText would flip to near-black in dark mode.
    color: "whiteContainer.main",
    fontVariantNumeric: "tabular-nums",
    fontFeatureSettings: '"tnum"',
  };

  const colonSx = {
    width: tight ? "5px" : "8px",
    flexShrink: 0,
    textAlign: "center",
    fontSize: { xs: tight ? "13px" : "15px", md: tight ? "16px" : "18px" },
    fontWeight: 700,
    color: "happyHourBanner.timerColon",
  };

  return (
    <>
      <BannerShell
        compact={compact}
        role="button"
        tabIndex={0}
        onClick={() => setOpenModal(true)}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "32px", md: "40px" },
            height: { xs: "32px", md: "40px" },
            "& svg": { width: "100%", height: "100%" },
          }}
        >
          <HappyHourIcon />
        </Box>

        <Stack sx={{ flex: 1, minWidth: 0, gap: "4px" }}>
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.48px",
              color: "neutral.1050",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {bannerTitle}
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
            {t("Grab best price for your order.")}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            flexShrink: 0,
            alignItems: "center",
            gap: tight ? "2px" : "4px",
            flexWrap: "nowrap",
          }}
        >
          {segments.map((value, index) => (
            <Fragment key={index}>
              {index > 0 && <Typography sx={colonSx}>:</Typography>}
              <Typography sx={timerNumberSx}>{value}</Typography>
            </Fragment>
          ))}
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

      {openModal && (
        <HappyHourViewModal
          openModal={openModal}
          handleClose={() => setOpenModal(false)}
          happyHour={happyHour}
          expireAt={expireAt}
        />
      )}
    </>
  );
};

export default HappyHourBanner;
