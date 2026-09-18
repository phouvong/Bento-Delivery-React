import React from "react";
import { Box, Stack, Typography, alpha, styled, useTheme } from "@mui/material";
import { t } from "i18next";
import moment from "moment/moment";
import { useRouter } from "next/router";
import NextImage from "components/NextImage";

const CARD_SHADOW =
  "0px 5px 9px 0px rgba(0,0,0,0.07), 0px 0px 4px 0px rgba(0,0,0,0.05)";

const CardRoot = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  cursor: "pointer",
  borderRadius: "16px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: CARD_SHADOW,
  overflow: "hidden",
}));

const ImageWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 9",
  overflow: "hidden",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const InfoPill = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: "6px",
  padding: "5px 10px",
  borderRadius: "8px",
  backgroundColor: theme.palette.background.secondary,
  width: "fit-content",
}));

const CampaignCard = ({ data }) => {
  const router = useRouter();
  const theme = useTheme();
  const camImage = data?.image_full_url;

  const handleClick = (campId, slug) => {
    router.push(
      {
        pathname: "/campaigns/[id]",
        query: { id: `${slug || campId}` },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <CardRoot onClick={() => handleClick(data?.id, data?.slug)}>
      <ImageWrapper>
        <NextImage
          src={camImage}
          alt={data?.title}
          fill
          objectFit="cover"
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${alpha(
              theme.palette.common.black,
              0,
            )} 60%, ${alpha(theme.palette.common.black, 0.55)} 100%)`,
          }}
        />
      </ImageWrapper>

      <Stack spacing={1.25} sx={{ p: "16px" }}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.48px",
            lineHeight: 1.2,
            textTransform: "capitalize",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {data?.title}
        </Typography>

        {data?.description && (
          <Typography
            sx={{
              fontSize: "13px",
              color: "neutral.500",
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {data?.description}
          </Typography>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexWrap="wrap"
          gap={{ xs: 0.75, sm: "10px" }}
          sx={{ pt: 0.5 }}
        >
          <Stack direction="row" alignItems="center" gap="6px">
            <i
              className="fi fi-rr-calendar"
              style={{
                fontSize: "13px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.text.secondary,
              }}
            />
            <Typography
              sx={{ fontSize: "12px", color: "neutral.500", whiteSpace: "nowrap" }}
            >
              {moment(data?.available_date_starts).format("MMM Do, YYYY")}
              {" – "}
              {moment(data?.available_date_ends).format("MMM Do, YYYY")}
            </Typography>
          </Stack>

          <InfoPill>
            <i
              className="fi fi-rr-clock"
              style={{
                fontSize: "13px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              {moment(data?.start_time, ["HH:mm"]).format("hh:mm a")}
              {" – "}
              {moment(data?.end_time, ["HH:mm"]).format("hh:mm a")}
            </Typography>
          </InfoPill>
        </Stack>
      </Stack>
    </CardRoot>
  );
};

export default CampaignCard;
