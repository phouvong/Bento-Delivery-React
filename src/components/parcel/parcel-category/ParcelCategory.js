import { useTheme } from "@emotion/react";
import { Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import { useEffect } from "react";
import useGetParcelCategory from "../../../api-manage/hooks/react-query/percel/usePercelCategory";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import H1 from "../../typographies/H1";
import ParcelCategoryCard from "./ParcelCategoryCard";
import ParcelCategoryShimmer from "./ParcelCategoryShimmer";

const ParcelCategory = () => {
  const theme = useTheme();

  const { data, refetch, isLoading } = useGetParcelCategory();
  useEffect(() => {
    refetch();
  }, []);
  return (
    <CustomStackFullWidth
      spacing={2.5}
      sx={{
        paddingBottom: { xs: "20px", sm: "30px", md: "50px" },
        marginTop: "30px",
      }}
    >
      <Stack justifyContent="center" spacing={{ xs: 1, md: 0 }}>
        <H1 text="We Deliver Everything" component="h2" />
        <Typography
          textAlign="center"
          color={theme.palette.neutral[400]}
          fontSize={{ xs: "12px", md: "14px" }}
        >
          {t("What are you wish to send?")}
        </Typography>
      </Stack>
      <CustomStackFullWidth>
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {!isLoading ? (
            <>
              {data?.map((item) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <ParcelCategoryCard data={item} />
                  </Grid>
                );
              })}
            </>
          ) : (
            <CustomStackFullWidth sx={{ marginTop: "50px" }}>
              <ParcelCategoryShimmer />
            </CustomStackFullWidth>
          )}
        </Grid>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default ParcelCategory;
