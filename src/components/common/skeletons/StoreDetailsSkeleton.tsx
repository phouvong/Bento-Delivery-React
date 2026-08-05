import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import CustomContainer from "components/container";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

const StatPill = () => (
  <Stack
    sx={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 0.5,
      backgroundColor: "background.secondary",
      borderRadius: "10px",
      p: 1.1,
    }}
  >
    <Skeleton variant="text" animation="wave" width={48} height={19} />
    <Skeleton variant="text" animation="wave" width={72} height={14} />
  </Stack>
);

const CouponCardSkeleton = () => (
  <Box
    sx={{
      flex: { xs: "1 1 100%", sm: 1 },
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      p: 1.5,
      borderRadius: "12px",
      backgroundColor: "background.secondary",
    }}
  >
    <Skeleton
      variant="circular"
      animation="wave"
      width={28}
      height={28}
      sx={{ flexShrink: 0 }}
    />
    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
      <Skeleton variant="text" animation="wave" width="40%" height={18} />
      <Skeleton variant="text" animation="wave" width="80%" height={14} />
    </Stack>
  </Box>
);

const StoreDetailsSkeleton = () => {
  return (
    <CustomStackFullWidth
      sx={{ minHeight: "100vh", mt: { xs: 0, md: 0, lg: "20px" } }}
    >
      <CustomContainer>
        <Box
          sx={{
            mt: { xs: 1.5, md: "45px" },
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
          }}
        >
          {/* Main column */}
          <Box sx={{ flex: { xs: "1 1 auto", md: 8.5 }, minWidth: 0 }}>
            <CustomStackFullWidth spacing={1.5}>
              {/* Hero card — info left, banner/logo right */}
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: { xs: "0 0 16px 16px", md: "16px" },
                  borderColor: "divider",
                  overflow: "hidden",
                }}
              >
                <Grid container alignItems="stretch">
                  <Grid
                    item
                    xs={12}
                    md={7}
                    sx={{ p: { xs: 2, sm: 2.5 }, order: { xs: 2, md: 1 } }}
                  >
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={180}
                      height={18}
                      sx={{ mb: 1.75 }}
                    />

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        width={68}
                        height={68}
                        sx={{ borderRadius: "12px", flexShrink: 0 }}
                      />
                      <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
                        <Skeleton
                          variant="text"
                          animation="wave"
                          width="60%"
                          height={26}
                        />
                        <Skeleton
                          variant="text"
                          animation="wave"
                          width="80%"
                          height={16}
                        />
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="stretch"
                      spacing={1}
                      sx={{ mt: 1.5 }}
                    >
                      <StatPill />
                      <StatPill />
                      <StatPill />
                    </Stack>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{
                      display: "flex",
                      order: { xs: 1, md: 2 },
                      minHeight: { xs: 160, md: "100%" },
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width="100%"
                      height="100%"
                      sx={{ minHeight: { xs: 160, md: "100%" } }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Coupon cards */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <CouponCardSkeleton />
                <CouponCardSkeleton />
              </Stack>

              {/* Category tabs */}
              <CustomStackFullWidth
                direction="row"
                spacing={2}
                sx={{ overflow: "hidden" }}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    animation="wave"
                    width={90}
                    height={32}
                    sx={{ borderRadius: "20px", flexShrink: 0 }}
                  />
                ))}
              </CustomStackFullWidth>

              {/* Service card grid */}
              <CustomStackFullWidth direction="row" flexWrap="wrap" gap={2}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSimmer
                    key={i}
                    cardWidth={undefined}
                    maxWidth={undefined}
                  />
                ))}
              </CustomStackFullWidth>
            </CustomStackFullWidth>
          </Box>

          {/* Cart sidebar column — desktop only */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flex: { md: 3.5 },
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "16px",
                p: 3,
                textAlign: "center",
              }}
            >
              <Skeleton
                variant="rectangular"
                animation="wave"
                width={64}
                height={64}
                sx={{ mx: "auto", mb: 2, borderRadius: "8px" }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                width="60%"
                height={22}
                sx={{ mx: "auto" }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                width="80%"
                height={16}
                sx={{ mx: "auto", mt: 0.5 }}
              />
            </Box>
          </Box>
        </Box>
      </CustomContainer>
    </CustomStackFullWidth>
  );
};

export default StoreDetailsSkeleton;
