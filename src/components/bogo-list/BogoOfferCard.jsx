import React from "react";
import { Box, Stack, Typography, styled } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/router";
import NextImage from "components/NextImage";

const CardRoot = styled(Box)({
  width: "100%",
  height: "100%",
  cursor: "pointer",
});

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  aspectRatio: "354 / 118",
  borderRadius: "12px",
  overflow: "hidden",
  backgroundColor: theme.palette.background.secondary,
}));

const BogoOfferCard = ({ data, onClick: onClickOverride }) => {
  const router = useRouter();
  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;

  // Callers embedding this card outside the BOGO list page (e.g. the chat
  // assistant) may need to run their own logic first (closing a popover,
  // confirming a module switch) — pass onClick to take over the navigation
  // entirely instead of the default self-navigate below.
  const handleClick =
    onClickOverride ??
    (() => {
      if (!data?.id) return;
      router.push(
        moduleParam
          ? `/bogo-list/${data.id}?module=${moduleParam}`
          : `/bogo-list/${data.id}`,
      );
    });

  return (
    <CardRoot
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <ImageWrapper>
        <NextImage src={data?.image_full_url} alt={data?.title} fill objectFit="cover" />
      </ImageWrapper>

      <Stack sx={{ gap: "6px", pt: "12px", px: "4px" }}>
        <Typography
          component="h3"
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.54px",
            color: "neutral.1050",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {data?.title}
        </Typography>

        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: "-0.42px",
            color: "info.main",
            textTransform: "uppercase",
          }}
        >
          {t("Buy {{buy}} Get {{get}}", {
            buy: data?.buy_qty ?? 1,
            get: data?.get_qty ?? 1,
          })}
        </Typography>

        <Typography
          sx={{
            fontSize: "16px",
            lineHeight: 1.3,
            color: "neutral.500",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {data?.description}
        </Typography>
      </Stack>
    </CardRoot>
  );
};

export default BogoOfferCard;
