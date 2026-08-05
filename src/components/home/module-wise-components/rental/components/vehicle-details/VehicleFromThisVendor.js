import { Grid, Skeleton, Typography } from "@mui/material";
import { t } from "i18next";
import CarCard from "../global/CarCard";
import { Box, Stack } from "@mui/system";
import useGetVehicleFromThisVendor from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/vehicle-from-this-vendor/useGetVehicleFromThisVendor";
import { useEffect } from "react";

const VehicleFromThisVendor = ({ vehicleDetails }) => {
  const provider_id = vehicleDetails?.provider?.id;
  const handleSuccess = (response) => {
  };

  const { data } = useGetVehicleFromThisVendor(handleSuccess, provider_id);

  return (
    <Stack>
      <Typography
        sx={{
          fontWeight: "600",
          color: (theme) => theme.palette.neutral[500],
          fontSize: "14px",
          mb: "10px",
          mt: "30px",
        }}
      >
        {t("Vehicle From This Vendor")}
      </Typography>

      <Grid container spacing={3}>
        {data?.vehicles.length > 0 ? (
          <>
            {data?.vehicles?.slice(0, 3)?.map((vehicle) => (
              <Grid item xs={12} sm={6} md={4} lg={12} key={vehicle?.id}>
                <CarCard direction="row" data={vehicle} />
              </Grid>
            ))}
          </>
        ) : (
          <>
            {[...Array(5)].map((item, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={12} key={index}>
                  <Skeleton variant="rounded" height={383} width="100%" />
                </Grid>
              );
            })}
          </>
        )}
      </Grid>
    </Stack>
  );
};

export default VehicleFromThisVendor;
