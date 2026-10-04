import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

const ProductDetailsSkeleton = () => {
  return (
    <CustomStackFullWidth paddingTop={{ xs: 0, md: "2.5rem" }}>
      <Box sx={{ display: { xs: "block", md: "none" }, height: 52 }} />

      <CustomStackFullWidth
        sx={{ px: { xs: 1.5, sm: 3, lg: 0 }, mb: { xs: 1.25, md: 2 } }}
      >
        <Skeleton variant="text" width={220} height={28} />
      </CustomStackFullWidth>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={8}>
          <CustomStackFullWidth spacing={3}>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "background.paper",
                borderRadius: { xs: "12px", md: "16px" },
                p: { xs: 0.5, sm: 1, md: 1.5 },
              }}
            >
              <Grid container spacing={{ xs: 2, md: 4 }}>
                <Grid item xs={12} sm={5} md={5}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={250}
                    sx={{ borderRadius: "12px" }}
                  />
                </Grid>
                <Grid item xs={12} sm={7} md={7}>
                  <CustomStackFullWidth spacing={1.5}>
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="50%" height={36} />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={56}
                      sx={{ borderRadius: "8px" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={44}
                      sx={{ borderRadius: "8px" }}
                    />
                  </CustomStackFullWidth>
                </Grid>
              </Grid>
            </Box>

            <CustomStackFullWidth spacing={1}>
              <Skeleton variant="text" width={160} height={26} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="60%" />
            </CustomStackFullWidth>

            <CustomStackFullWidth spacing={1}>
              <Skeleton variant="text" width={140} height={26} />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={90}
                sx={{ borderRadius: "8px" }}
              />
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomStackFullWidth spacing={3}>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "background.paper",
                borderRadius: "12px",
                p: 2,
              }}
            >
              <CustomStackFullWidth
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Skeleton variant="circular" width={48} height={48} />
                <CustomStackFullWidth spacing={0.5}>
                  <Skeleton variant="text" width="70%" height={22} />
                  <Skeleton variant="text" width="40%" height={18} />
                </CustomStackFullWidth>
              </CustomStackFullWidth>
            </Box>
          </CustomStackFullWidth>
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

export default ProductDetailsSkeleton;
