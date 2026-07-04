import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

// ── Vertical skeleton ─────────────────────────────────────────────────────────
// Mirrors NewProductCard vertical layout:
//   [square image with add-btn stub bottom-right]
//   [store logo + store name · · · · · · · rating]
//   [product name line 1]
//   [product name line 2]
//   [price  original-price]
//   [discount-badge  free-badge]
const VerticalSkeleton = ({ cardWidth }) => (
  <Box
    sx={{
      width: cardWidth ?? { xs: "150px", md: "180px" },
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: { xs: "6px", md: "8px" },
    }}
  >
    {/* Image area */}
    <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height="100%"
        sx={{ borderRadius: "12px" }}
      />
      {/* Add-button stub — bottom-right */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          position: "absolute",
          bottom: 9,
          right: 9,
          width: 36,
          height: 36,
          borderRadius: "8px",
        }}
      />
    </Box>

    {/* Info block */}
    <Stack sx={{ px: "4px", pt: "8px", gap: "6px" }}>
      {/* Store row: logo circle + name + rating */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap="4px" sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton variant="circular" animation="wave" width={14} height={14} sx={{ flexShrink: 0 }} />
          <Skeleton variant="text" animation="wave" width="50%" height={13} />
        </Stack>
        <Stack direction="row" alignItems="center" gap="2px" sx={{ flexShrink: 0, ml: "4px" }}>
          <Skeleton variant="circular" animation="wave" width={12} height={12} />
          <Skeleton variant="text" animation="wave" width={22} height={13} />
        </Stack>
      </Stack>

      {/* Product name — 2 lines */}
      <Stack gap="3px">
        <Skeleton variant="text" animation="wave" width="95%" height={14} />
        <Skeleton variant="text" animation="wave" width="70%" height={14} />
      </Stack>

      {/* Price row */}
      <Stack direction="row" alignItems="baseline" gap="4px">
        <Skeleton variant="text" animation="wave" width="45%" height={18} />
        <Skeleton variant="text" animation="wave" width="28%" height={13} />
      </Stack>

      {/* Badge row */}
      <Stack direction="row" gap="4px">
        <Skeleton variant="rectangular" animation="wave" width={44} height={20} sx={{ borderRadius: "24px" }} />
        <Skeleton variant="rectangular" animation="wave" width={50} height={20} sx={{ borderRadius: "24px" }} />
      </Stack>
    </Stack>
  </Box>
);

// ── Horizontal skeleton ───────────────────────────────────────────────────────
// Mirrors NewProductCard horizontal layout:
//   LEFT: [store name · · · · · · · · · · rating]
//         [product name line 1]
//         [product name line 2]
//         [price  original-price]
//         [discount-badge  free-badge]
//   RIGHT: [square image with add-btn stub bottom-right]
const HorizontalSkeleton = ({ maxWidth }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: maxWidth ?? "398px",
      height: { xs: "120px", sm: "150px" },
      display: "flex",
      alignItems: "center",
      gap: "8px",
      borderRadius: "12px",
      overflow: "hidden",
      pl: "12px",
      pr: "8px",
      py: "10px",
      backgroundColor: "background.paper",
    }}
  >
    {/* Info left */}
    <Stack sx={{ flex: 1, minWidth: 0, gap: "5px", justifyContent: "center" }}>
      {/* Store + rating */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap="4px">
          <Skeleton variant="circular" animation="wave" width={14} height={14} />
          <Skeleton variant="text" animation="wave" width={60} height={13} />
        </Stack>
        <Stack direction="row" alignItems="center" gap="2px">
          <Skeleton variant="circular" animation="wave" width={12} height={12} />
          <Skeleton variant="text" animation="wave" width={22} height={13} />
        </Stack>
      </Stack>
      {/* Name */}
      <Skeleton variant="text" animation="wave" width="90%" height={14} />
      <Skeleton variant="text" animation="wave" width="65%" height={14} />
      {/* Price */}
      <Stack direction="row" alignItems="baseline" gap="4px">
        <Skeleton variant="text" animation="wave" width={55} height={18} />
        <Skeleton variant="text" animation="wave" width={36} height={13} />
      </Stack>
      {/* Badges */}
      <Stack direction="row" gap="4px">
        <Skeleton variant="rectangular" animation="wave" width={40} height={18} sx={{ borderRadius: "24px" }} />
        <Skeleton variant="rectangular" animation="wave" width={44} height={18} sx={{ borderRadius: "24px" }} />
      </Stack>
    </Stack>

    {/* Image right */}
    <Box
      sx={{
        position: "relative",
        width: { xs: "96px", sm: "126px" },
        height: { xs: "96px", sm: "126px" },
        flexShrink: 0,
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height="100%"
        sx={{ borderRadius: "8px" }}
      />
      {/* Add-button stub */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          position: "absolute",
          bottom: 7,
          right: 7,
          width: 28,
          height: 28,
          borderRadius: "6px",
        }}
      />
    </Box>
  </Box>
);

const ProductCardSimmer = ({
  variant = "vertical",
  cardWidth,
  maxWidth,
}) => {
  if (variant === "horizontal") {
    return <HorizontalSkeleton maxWidth={maxWidth} />;
  }
  return <VerticalSkeleton cardWidth={cardWidth} />;
};

export default ProductCardSimmer;
