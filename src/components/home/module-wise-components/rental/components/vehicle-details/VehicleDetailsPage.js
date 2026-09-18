import { Box, Grid } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CustomContainer from "components/container";
import VehicleDetailsReview from "./VehicleDetailsReview";
import VisitVendor from "./VisitVendor";
import VehicleDetailsTopSection from "./VehicleDetailsTopSection";
import VehicleFromThisVendor from "./VehicleFromThisVendor";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { useRouter } from "next/router";
import { useGetVehicleDetails } from "../../rental-api-manage/hooks/react-query/details/useGetVehicleDetails";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import useGetVehicleReview from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/details/useGetVehicleReview";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";

const VehicleDetailsPage = ({ vehicleDetailsData }) => {
  useScrollToTop();
  const { t } = useTranslation();
  const router = useRouter();
  const { id, from } = router.query;
  const { cartList } = useSelector((state) => state.cart);
  const rentalSearch = useSelector(
    (state) => state?.rentalSearch?.rentalSearch
  );

  const [selectedPricing, setSelectedPricing] = useState("hourly");
  const [typeWisePrice, setTypeWisePrice] = useState(null);
  const { data: vehicleDetailsQuery } = useGetVehicleDetails(id, {
    enabled: !vehicleDetailsData && Boolean(id),
  });
  const vehicleDetails = vehicleDetailsData || vehicleDetailsQuery;

  const isProductExist = () => {
    return cartList?.carts?.find(
      (item) => item.vehicle?.id === vehicleDetails?.id
    );
  };

  const priceForType = (tripType) => {
    if (tripType === "hourly") return vehicleDetails?.hourly_price;
    if (tripType === "distance_wise") return vehicleDetails?.distance_price;
    if (tripType === "day_wise") return vehicleDetails?.day_wise_price;
    return null;
  };

  useEffect(() => {
    if (!vehicleDetails) return;

    // When the user arrived from the search flow, the search-bar trip type
    // drives both the selected pricing and the per-unit price — regardless
    // of whether this vehicle is already in the cart.
    if (from === "from_search" && rentalSearch?.tripType) {
      const tripType = rentalSearch.tripType;
      setSelectedPricing(tripType);
      setTypeWisePrice(priceForType(tripType));
      return;
    }

    if (isProductExist()) {
      const rentalType = cartList?.user_data?.rental_type;
      setTypeWisePrice(priceForType(rentalType));
      setSelectedPricing(rentalType);
    } else if (rentalSearch) {
      setSelectedPricing(rentalSearch?.tripType);
    } else {
      setSelectedPricing(null);
    }
  }, [rentalSearch?.tripType, cartList, from, vehicleDetails]);

  if (!vehicleDetails) {
    return null;
  }
  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : "rental";
  const homeHref = `/home?module=${moduleParam}`;
  const providerName =
    vehicleDetails?.provider?.name ??
    vehicleDetails?.provider_name ??
    vehicleDetails?.vendor_name;
  const providerId =
    vehicleDetails?.provider?.id ?? vehicleDetails?.provider_id;
  const providerHref = providerId
    ? `/rental/provider/${providerId}?module=${moduleParam}`
    : undefined;

  const breadcrumbItems = [
    {
      key: "home",
      label: t("Home"),
      icon: <HomeOutlinedIcon style={{ fontSize: "14px" }} />,
      onRedirect: homeHref,
    },
    ...(providerName
      ? [
          {
            key: "provider",
            label: providerName,
            ...(providerHref ? { onRedirect: providerHref } : {}),
          },
        ]
      : []),
    {
      key: "vehicle",
      label: vehicleDetails?.name,
    },
  ];

  return (
    <CustomContainer>
      <CustomStackFullWidth>
        <Box sx={{ mt: { xs: 2, md: 1 }, pt: { xs: 1, md: 0 } }}>
          <CustomPageBreadCrumb items={breadcrumbItems} />
        </Box>
        <Grid container spacing={2.5} sx={{ mt: { xs: "10px", md: "24px" } }}>
          <Grid item xs={12} lg={9}>
            <Stack sx={{ position: "sticky", top: "100px" }}>
              <VehicleDetailsTopSection
                vehicleDetails={vehicleDetails}
                // handleSelect={handleSelect}
                selectedPricing={selectedPricing}
                tripHours={rentalSearch?.duration}
                typeWisePrice={typeWisePrice}
                userData={cartList?.carts?.length > 0 && cartList?.user_data}
                from={from}
                rentalSearch={rentalSearch}
              />
              <VehicleDetailsReview
                vehicleDetails={vehicleDetails}
                borderRadius="10px"
              />
            </Stack>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Stack sx={{ position: "sticky", top: "100px" }}>
              <VisitVendor vehicleDetails={vehicleDetails} />
              <VehicleFromThisVendor vehicleDetails={vehicleDetails} />
            </Stack>
          </Grid>
        </Grid>
        {/*<VehicleDetailsRentThisCar vehicleDetails={vehicleDetails} />*/}
      </CustomStackFullWidth>
    </CustomContainer>
  );
};

export default VehicleDetailsPage;
