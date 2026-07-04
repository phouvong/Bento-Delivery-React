import { Box, Grid, Skeleton, Stack, useTheme } from "@mui/material";

// Skeleton that mirrors the real <NewCouponCard /> layout so the loading
// state matches the coupon card shape (ticket header, dashed divider with
// cutouts, description, code + copy row).
const CouponSkeletonCard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const cardBg = isDark ? theme.palette.neutral[200] : theme.palette.neutral[100];
  const dashedColor = isDark ? "rgba(255,255,255,0.15)" : "#ffffff";

  const cutout = (justify) => (
    <Box
      sx={{
        width: "10px",
        height: "20px",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: justify,
      }}
    >
      <Box
        sx={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "background.paper",
          flexShrink: 0,
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: cardBg,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Top: icon + title + discount */}
      <Stack
        direction="row"
        alignItems="center"
        gap="10px"
        sx={{ px: "16px", pt: "12px", pb: "4px" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{ flex: 1, minWidth: 0 }}
        >
          <Skeleton variant="rounded" width={20} height={20} />
          <Skeleton variant="text" width="65%" height={16} />
        </Stack>
        <Skeleton variant="text" width={56} height={20} />
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
        {cutout("flex-end")}
        <Box sx={{ flex: 1, minWidth: 0, position: "relative", height: "2px" }}>
          <Box
            sx={{
              position: "absolute",
              inset: "-1px 0",
              borderTop: `2px dashed ${dashedColor}`,
            }}
          />
        </Box>
        {cutout("flex-start")}
      </Box>

      {/* Description */}
      <Box sx={{ px: "16px", pt: "8px", pb: "8px" }}>
        <Skeleton variant="text" width="92%" height={12} />
        <Skeleton variant="text" width="60%" height={12} />
      </Box>

      {/* Bottom: code + copy */}
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{ px: "16px", pt: 0, pb: "12px" }}
      >
        <Skeleton variant="text" width="40%" height={22} sx={{ flex: 1 }} />
        <Skeleton variant="circular" width={28} height={28} />
      </Stack>
    </Box>
  );
};

const CustomShimmerCard = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <CouponSkeletonCard />
        </Grid>
      ))}
    </>
  );
};

export default CustomShimmerCard;
