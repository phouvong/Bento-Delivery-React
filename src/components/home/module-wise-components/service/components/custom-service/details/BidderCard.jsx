import { Box, Button, Stack, Typography, useTheme, alpha } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import customServiceEmptyIcon from "public/static/custom-service-empty.svg";
import StarRoundedIcon from "@mui/icons-material/StarRounded";


const BidderCard = ({ bidder, onDeny, onApprove, isDisabled, hideActions }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: "8px",
        p: { xs: 2, md: 2.5 },
      }}
    >
      {/* Top row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={{ xs: 1.5, sm: 2 }}
        flexDirection={{xs: "row-reverse", sm: "row"}}
        flexWrap="wrap"
      >
        <Stack
            direction="row"
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            width={{ xs: "100%", sm: "auto" }}
            gap={{ xs: 1.5, sm: 2 }}
            order="1"
        >
            {/* Avatar + name/rating */}
            <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.5 }} sx={{ flex: 1, minWidth: 0 }}>
            <Box
                sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                backgroundColor: theme.palette.background.secondary,
                border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Image
                src={bidder.logo || customServiceEmptyIcon}
                alt={bidder.providerName}
                width={50}
                height={50}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
            </Box>
            <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    noWrap
                    sx={{
                    fontSize: { xs: "16px", md: "18px" },
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    }}
                >
                    {bidder.providerName}
                </Typography>
                <Stack direction="row" alignItems="center" gap={0.5}>
                    <StarRoundedIcon
                        sx={{ fontSize: 12, color: theme.palette.warning.new }}
                    />
                    <Typography
                        sx={{ fontSize: "12px", color: theme.palette.text.secondary, lineHeight: 1 }}
                    >
                        {bidder.rating.toFixed(1)} ({bidder.reviews} {t("Reviews")})
                    </Typography>
                </Stack>
            </Stack>
            </Stack>

            {/* Offer price pill */}
            <Box
            sx={{
                px: 2,
                py: 0.75,
                borderRadius: "8px",
                backgroundColor: theme.palette.background.secondary,
                flexShrink: 0,
            }}
            >
            <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" gap={1}>
                <Typography
                sx={{ fontSize: "14px", color: theme.palette.text.secondary, lineHeight: 1 }}
                >
                {t("Offer Price")}
                </Typography>
                <Typography
                sx={{
                    fontSize: { xs: "16px", md: "18px" },
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    lineHeight: 1,
                }}
                >
                ${bidder.offerPrice.toFixed(2)}
                </Typography>
            </Stack>
            </Box>
        </Stack>

        {/* Action buttons — hidden once the post is already booked */}
        {!hideActions && (
          <Stack direction="row" gap={1.5} flexShrink={0} order={{xs: 3, sm: "2"}}>
            <Button
              variant="outlined"
              disabled={isDisabled}
              onClick={() => onDeny(bidder.id)}
              sx={{
                borderRadius: "8px",
                px: { xs: 2, md: 2.5 },
                py: 0.875,
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                border: "none",
                "&:hover": {
                  border: "none",
                  backgroundColor: alpha(theme.palette.text.primary, 0.6),
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              {t("Deny")}
            </Button>
            <Button
              variant="contained"
              disabled={isDisabled}
              onClick={() => onApprove(bidder.id)}
              disableElevation
              sx={{
                borderRadius: "8px",
                px: { xs: 2, md: 2.5 },
                py: 0.875,
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.whiteContainer.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
                "&:disabled": {
                  opacity: 0.5,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.whiteContainer.main,
                },
              }}
            >
              {t("Approve")}
            </Button>
          </Stack>
        )}

        {/* Description */}
        {bidder.description && (
            <Typography
            sx={{
                fontSize: "14px",
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
                order: {xs: 2, sm: "3"},
            }}
            >
            {bidder.description}
            </Typography>
        )}
      </Stack>

    </Box>
  );
};

export default BidderCard;