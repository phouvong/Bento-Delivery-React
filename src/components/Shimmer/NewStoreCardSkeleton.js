import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

// Matches NewStoreCard variant="normal" layout:
//   [banner image 350:175 ratio] with wishlist-btn stub top-right
//   [store name · · · · · · · · · · · · · · · · · · · rating]
//   [category tags text]
//   [clock-icon  delivery-time · distance]
//   [free-delivery badge?]
const NewStoreCardSkeleton = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%" }}>
    {/* Banner image */}
    <Box sx={{ position: "relative", width: "100%", aspectRatio: "350 / 175" }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height="100%"
        sx={{ borderRadius: "12px" }}
      />
      {/* Wishlist stub — top-right */}
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{ position: "absolute", top: 10, right: 10, width: 32, height: 32 }}
      />
    </Box>

    {/* Info block — pt:8 px:4 */}
    <Box sx={{ pt: "8px", px: "4px", display: "flex", flexDirection: "column", gap: "6px" }}>
      {/* Row 1: store name + rating */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap="16px">
        <Skeleton variant="text" animation="wave" width="55%" height={18} sx={{ flexShrink: 1 }} />
        <Stack direction="row" alignItems="center" gap="2px" sx={{ flexShrink: 0 }}>
          <Skeleton variant="circular" animation="wave" width={13} height={13} />
          <Skeleton variant="text" animation="wave" width={30} height={16} />
        </Stack>
      </Stack>

      {/* Row 2: category tags */}
      <Skeleton variant="text" animation="wave" width="70%" height={14} />

      {/* Row 3: delivery time + distance */}
      <Stack direction="row" alignItems="center" gap="8px">
        <Stack direction="row" alignItems="center" gap="4px">
          <Skeleton variant="circular" animation="wave" width={13} height={13} />
          <Skeleton variant="text" animation="wave" width={80} height={14} />
        </Stack>
      </Stack>
    </Box>
  </Box>
);

export default NewStoreCardSkeleton;
