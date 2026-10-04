import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Card, Grid } from "@mui/material";
import { Skeleton } from "@mui/material";

const ParcelCategoryShimmer = () => {
  return (
    <CustomStackFullWidth>
      <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
        {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ padding: "20px" }}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={4}>
                            <Skeleton width="100%" height="108px" variant="rounded" />
                        </Grid>
                        <Grid item xs={8}>
                            <Skeleton width="50%" height="20px" variant="text" />
                            <Skeleton width="80%" height="20px" variant="text" />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        ))}
      </Grid>
    </CustomStackFullWidth>
  );
};

export default ParcelCategoryShimmer;
