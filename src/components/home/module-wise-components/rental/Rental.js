import CustomContainer from "components/container";
import RentalBanner from "components/home/module-wise-components/rental/components/global/RentalBanner";
import { RentalModuleWrap } from "components/home/module-wise-components/rental/components/Rental.style";
import TopRatedVehicles from "components/home/module-wise-components/rental/components/home/TopRatedVehicles";
import VerifiedProviders from "components/home/module-wise-components/rental/components/home/VerifiedProviders";
import isVerifiedStoreEnabled from "helper-functions/isVerifiedStoreEnabled";
import VehicleCategories from "components/home/module-wise-components/rental/components/home/VehicleCategories";
import CouponsCarousel from "components/home/module-wise-components/rental/components/home/CouponsCarousel";
import DownloadSection from "components/home/module-wise-components/rental/components/home/DownloadSection";
import { getToken } from "helper-functions/getToken";
import TrendingBites from "components/home/trending-bites";
import ModuleSearchBanner from "../shared/ModuleSearchBanner";
import TaxiSearchPanel from "./components/global/search/TaxiSearchPanel";
import LastOrdersSection from "../food/LastOrdersSection";
import { DEMO_RENTAL_LAST_TRIPS } from "components/cards/newCard/lastOrderModel";
import { Box, Stack, useTheme } from "@mui/material";
import { t } from "i18next";
import MobileAppBanner from "components/home/MobileAppBanner";
import { useGetVerifiedProviders } from "components/home/module-wise-components/rental/rental-api-manage/hooks/verified-providers/useGetVerifiedProviders";

const SECTION_GAP = { xs: "25px", md: "20px" };

const S = ({ children }) => children ?? null;

const Rental = ({ configData, landingPageData }) => {
  const theme = useTheme();
  const { data: verifiedProvidersData, isLoading: verifiedProvidersLoading } =
    useGetVerifiedProviders();
  const verifiedProvidersListRaw =
    verifiedProvidersData?.stores ??
    verifiedProvidersData?.providers ??
    verifiedProvidersData?.data ??
    verifiedProvidersData ??
    null;
  const hasVerifiedProviders =
    isVerifiedStoreEnabled(configData) &&
    Array.isArray(verifiedProvidersListRaw) &&
    verifiedProvidersListRaw.length > 0;
  return (
    <Stack gap={{ xs: "16px", lg: "32px" }}>
      <S>
        <CustomContainer
          sx={{
            mt: { xs: 0, md: "24px" },
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            background: {
              xs: `linear-gradient(180deg, ${theme.palette.background.paper} 43.86%, ${theme.palette.background.default} 77.22%)`,
              md: "none",
            },
          }}
        >
          <ModuleSearchBanner
            title="Rent the Perfect Car for Every Journey"
            subtitle="Choose from a wide range of cars and enjoy a smooth, reliable rental experience."
            component={<TaxiSearchPanel position="relative" mt="0" />}
            maxWidth="1300px"
            isRental
          />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <RentalBanner />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer>
          <VehicleCategories />
        </CustomContainer>
      </S>

      <S>
        {getToken() &&
        Array.isArray(DEMO_RENTAL_LAST_TRIPS) &&
        DEMO_RENTAL_LAST_TRIPS.length > 0 ? (
          <CustomContainer>
            <LastOrdersSection
              title={t("Your Last Trips")}
              orders={DEMO_RENTAL_LAST_TRIPS}
              transparent
            />
          </CustomContainer>
        ) : null}
      </S>

      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
            overflowX: "hidden",
          }}
        >
          <TrendingBites
            title="Ready to Ride"
            subtitle="Watch, choose, and book your ride"
          />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer
          sx={{
            paddingLeft: "0 !important",
            paddingRight: "0 !important",
            overflowX: "hidden",
          }}
        >
          <TopRatedVehicles />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer noMobilePadding>
          <MobileAppBanner />
        </CustomContainer>
      </S>
      {hasVerifiedProviders && (
        <S>
          <CustomContainer
            sx={{
              paddingLeft: "16px !important",
              paddingRight: "0 !important",
              overflowX: "hidden",
            }}
          >
            <VerifiedProviders
              data={verifiedProvidersData}
              isLoading={verifiedProvidersLoading}
            />
          </CustomContainer>
        </S>
      )}
      <RentalModuleWrap>
        {/* <CustomContainer sx={{ mt: { md: "24px" } }}>
        <Stack spacing={0} sx={{ "& > * + *": { mt: SECTION_GAP } }}>
          <ModuleSearchBanner
            title="Rent the Perfect Car for Every Journey"
            subtitle="Choose from a wide range of cars and enjoy a smooth, reliable rental experience."
            component={<TaxiSearchPanel position="relative" mt="0" />}
            maxWidth="1300px"
            isRental
          />
          <Box sx={{ mt: { xs: "20px", md: "30px" } }}>
            <RentalBanner />
          </Box>
          <VehicleCategories />
          {getToken() &&
          Array.isArray(DEMO_RENTAL_LAST_TRIPS) &&
          DEMO_RENTAL_LAST_TRIPS.length > 0 ? (
            <LastOrdersSection
              title={t("Your Last Trips")}
              orders={DEMO_RENTAL_LAST_TRIPS}
              transparent
            />
          ) : null}

          <Box sx={{ my: { xs: "5px", md: "20px" } }}>
            <TrendingBites
              title="Expert at Work"
              subtitle="Discover professionals solving real problems"
            />
          </Box>
          <Box sx={{ my: { xs: "5px", md: "10px" } }}>
            <TopRatedVehicles />
          </Box>
          <Box sx={{ my: { xs: "5px", md: "10px" } }}>
            <VerifiedProviders />
          </Box>
        </Stack>
      </CustomContainer> */}
      </RentalModuleWrap>
    </Stack>
  );
};

Rental.propTypes = {};

export default Rental;
