import { useTheme } from "@emotion/react";
import { Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useGetParcelCategory from "../../../api-manage/hooks/react-query/percel/usePercelCategory";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import H1 from "../../typographies/H1";
import ParcelCategoryCard from "./ParcelCategoryCard";
import ParcelCategoryShimmer from "./ParcelCategoryShimmer";
import ParcelInformationModal from "../parcel-information/ParcelInformationModal";
import useParcelZoneId from "../../../api-manage/hooks/react-query/percel/useParcelZoneId";
import toast from "react-hot-toast";

const ParcelCategory = () => {
  const theme = useTheme();
  const router = useRouter();
  // Picking a category no longer jumps straight to the address screen — it
  // opens the parcel information modal so weight and dimension are chosen
  // up front, and only then continues.
  const [infoOpen, setInfoOpen] = useState(false);
  const [pendingCategoryId, setPendingCategoryId] = useState(null);

  const { data, refetch, isFetched, isLoading } = useGetParcelCategory();
  const { zoneId: parcelZoneId, isResolving: parcelZoneResolving } =
    useParcelZoneId();
  useEffect(() => {
    refetch();
  }, []);

  const handleCategorySelect = (category) => {
    if (parcelZoneResolving) return;
    if (parcelZoneId === undefined) {
      toast.error(t("Parcel service is not available in your zone"));
      return;
    }
    setPendingCategoryId(category?.id ?? null);
    setInfoOpen(true);
  };
  return (
    <CustomStackFullWidth
      spacing={2.5}
      sx={{
        paddingBottom: { xs: "20px", sm: "30px", md: "30px" },
        marginTop: "40px",
      }}
    >
      <Stack justifyContent="center" spacing={{ xs: 1, md: 0 }}>
        <H1
          text="We Deliver Everything"
          component="h2"
          sx={{ fontSize: { xs: "15px", md: "32px" }, color: "neutral.1050" }}
        />
        <Typography
          textAlign="center"
          color={theme.palette.neutral[400]}
          fontSize={{ xs: "12px", md: "14px" }}
        >
          {t("What are you wish to send?")}
        </Typography>
      </Stack>
      <CustomStackFullWidth>
        <Grid container spacing={{ xs: 1.5, sm: 3, md: 3 }}>
          {!isLoading ? (
            <>
              {data &&
                data?.map((item) => {
                  return (
                    <Grid item xs={6} sm={6} md={4} key={item.id}>
                      <ParcelCategoryCard
                        data={item}
                        onClick={handleCategorySelect}
                      />
                    </Grid>
                  );
                })}
            </>
          ) : (
            <CustomStackFullWidth sx={{ marginTop: "24px" }}>
              <ParcelCategoryShimmer />
            </CustomStackFullWidth>
          )}
        </Grid>
      </CustomStackFullWidth>
      <ParcelInformationModal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        categories={data}
        initialCategoryId={pendingCategoryId}
        onConfirm={() => {
          setInfoOpen(false);
          router.push("/parcel-delivery-info", undefined, { shallow: true });
        }}
      />
    </CustomStackFullWidth>
  );
};

export default ParcelCategory;
