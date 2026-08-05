import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {
  Box,
  Grid,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useGetWishList } from "api-manage/hooks/react-query/rental-wishlist/useGetWishlist";
import { getToken } from "helper-functions/getToken";
import CustomContainer from "components/container";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import CarCard from "components/home/module-wise-components/rental/components/global/CarCard";
import RentalProviderCard from "components/home/module-wise-components/rental/components/global/RentalProviderCard";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { setWishList } from "redux/slices/wishList";
import { useDispatch } from "react-redux";

const TAB_ALL = "all";
const TAB_VEHICLES = "vehicles";
const TAB_PROVIDERS = "providers";

const EmptyWishlist = ({ label, t }) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    spacing={2}
    sx={{ py: { xs: "60px", md: "80px" } }}
  >
    <Box
      sx={{
        width: { xs: "80px", md: "100px" },
        height: { xs: "80px", md: "100px" },
        borderRadius: "50%",
        backgroundColor: "primary.light",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <i
        className="fi fi-rr-heart"
        style={{
          fontSize: "36px",
          color: "var(--mui-palette-primary-main, #FC6B0E)",
          display: "flex",
          lineHeight: 1,
        }}
      />
    </Box>
    <Stack alignItems="center" spacing={0.5}>
      <Typography
        sx={{
          fontSize: { xs: "16px", md: "18px" },
          fontWeight: 700,
          color: "neutral.1050",
          letterSpacing: "-0.5px",
        }}
      >
        {t(label)}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "13px", md: "14px" },
          color: "neutral.500",
          textAlign: "center",
          maxWidth: "260px",
        }}
      >
        {t("Save your favourite items and stores here")}
      </Typography>
    </Stack>
  </Stack>
);

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

const FilterPill = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      height: { xs: "26px", md: "36px" },
      px: { xs: "12px", md: "16px" },
      py: "8px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: active ? "primary.main" : "background.secondary",
      transition: "background-color 0.15s",
      userSelect: "none",
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: "12px", md: "14px" },
        fontWeight: 600,
        color: active ? "#fff" : "neutral.1050",
        letterSpacing: "-0.42px",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
  </Box>
);

const SectionTitle = ({ children }) => (
  <Typography
    sx={{
      fontSize: { xs: "18px", md: "24px" },
      fontWeight: 700,
      color: "neutral.1050",
      letterSpacing: "-1.2px",
      lineHeight: 1.1,
    }}
  >
    {children}
  </Typography>
);

const AllResult = ({
  vehicles,
  providers,
  vehiclesLabel,
  providersLabel,
  t,
  theme,
}) => {
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [vehiclesSlide, setVehiclesSlide] = useState(0);
  const [providersSlide, setProvidersSlide] = useState(0);
  const vehiclesRef = useRef(null);
  const providersRef = useRef(null);

  const vehiclesSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4.2,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1450, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 760, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2.6 } },
      { breakpoint: 400, settings: { slidesToShow: 2.2 } },
      { breakpoint: 360, settings: { slidesToShow: 2 } },
    ],
  };

  const providersSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.3,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1.5 } },
      { breakpoint: 480, settings: { slidesToShow: 1.27 } },
      { breakpoint: 400, settings: { slidesToShow: 1.1 } },
      { breakpoint: 350, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Stack spacing={4}>
      {vehicles.length > 0 && (
        <Stack
          spacing={2}
          sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: 0, md: 0 } }}
        >
          <SliderSectionHeader
            sliderRef={vehiclesRef}
            currentSlide={vehiclesSlide}
            totalSlides={vehicles.length}
            slidesToShow={5}
            heading={<SectionTitle>{vehiclesLabel}</SectionTitle>}
          />
          <SliderWrapper>
            <Slider
              ref={vehiclesRef}
              afterChange={setVehiclesSlide}
              {...vehiclesSettings}
            >
              {vehicles.map((item) => (
                <div key={item?.id}>
                  <CarCard data={item} />
                </div>
              ))}
            </Slider>
          </SliderWrapper>
        </Stack>
      )}

      {providers.length > 0 && (
        <Stack
          spacing={2}
          sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: 0, md: 0 } }}
        >
          <SliderSectionHeader
            sliderRef={providersRef}
            currentSlide={providersSlide}
            totalSlides={providers.length}
            slidesToShow={2.8}
            heading={<SectionTitle>{providersLabel}</SectionTitle>}
          />
          <SliderWrapper>
            <Slider
              ref={providersRef}
              afterChange={setProvidersSlide}
              {...providersSettings}
            >
              {providers.map((provider) => (
                <div key={provider?.id}>
                  <RentalProviderCard data={provider} initialWishlisted />
                </div>
              ))}
            </Slider>
          </SliderWrapper>
        </Stack>
      )}

      {vehicles.length === 0 && providers.length === 0 && (
        <EmptyWishlist label="No favourites found" t={t} />
      )}
    </Stack>
  );
};

const VehiclesResult = ({ vehicles, vehiclesLabel, t, theme }) => {
  if (vehicles.length === 0)
    return <EmptyWishlist label="No favourite items found" t={t} />;
  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{vehiclesLabel}</SectionTitle>
      <Box sx={{ overflow: "hidden" }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {vehicles.map((item) => (
            <Grid key={item?.id} item xs={6} sm={4} md={3} lg={2.4}>
              <CarCard data={item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

const ProvidersResult = ({ providers, providersLabel, t }) => {
  if (providers.length === 0)
    return <EmptyWishlist label="No favourite stores found" t={t} />;
  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{providersLabel}</SectionTitle>
      <Box sx={{ overflow: "hidden" }}>
        <Grid container spacing={3}>
          {providers.map((provider) => (
            <Grid key={provider?.id} item xs={12} sm={6} md={4}>
              <RentalProviderCard data={provider} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

const RentalWishListLayout = ({ configData }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const token = getToken();
  const dispatch = useDispatch();

  const onSuccessHandler = (response) => {
    dispatch(setWishList(response));
  };

  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;

  const { data: wishlistData, refetch } = useGetWishList(onSuccessHandler);

  useEffect(() => {
    if (token) refetch();
  }, [token]);

  const allVehicles = wishlistData?.vehicles || [];
  const allProviders = wishlistData?.providers || [];

  const vehiclesLabel = t("Vehicles");
  const providersLabel = t("Providers");

  const activeTab = router.query.data_type_tab || TAB_ALL;

  const handleTabChange = (tab) => {
    router.push({ query: { ...router.query, data_type_tab: tab } }, undefined, {
      shallow: true,
    });
  };

  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";

  const showTabWiseView = (tab) => {
    switch (tab) {
      case TAB_ALL:
        return (
          <AllResult
            vehicles={allVehicles}
            providers={allProviders}
            vehiclesLabel={vehiclesLabel}
            providersLabel={providersLabel}
            t={t}
            theme={theme}
          />
        );
      case TAB_VEHICLES:
        return (
          <VehiclesResult
            vehicles={allVehicles}
            vehiclesLabel={vehiclesLabel}
            t={t}
            theme={theme}
          />
        );
      case TAB_PROVIDERS:
        return (
          <ProvidersResult
            providers={allProviders}
            providersLabel={providersLabel}
            t={t}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SimpleMobileHeader title="Favourite" />
      <CustomContainer noMobilePadding>
        <Stack spacing={2}>
          {/* Breadcrumb + tabs */}
          <Stack
            direction="row"
            alignItems="center"
            gap={{ xs: "8px", md: "12px" }}
            sx={{
              flexWrap: "nowrap",
              backgroundColor: "background.default",
              py: { xs: "8px", md: "12px" },
              position: { xs: "static", md: "sticky" },
              top: { md: "63px" },
              zIndex: { md: 10 },
              px: { xs: "20px", md: 0 },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <CustomPageBreadCrumb
                items={[
                  {
                    key: "home",
                    label: t("Home"),
                    icon: <HomeOutlinedIcon style={{ fontSize: "14px" }} />,
                    onRedirect: homeHref,
                  },
                  { key: "wishlist", label: t("Favourite") },
                ]}
              />
            </Box>
            <Stack direction="row" alignItems="center" gap="8px" flexShrink={0}>
              <FilterPill
                label={t("All")}
                active={activeTab === TAB_ALL}
                onClick={() => handleTabChange(TAB_ALL)}
              />
              <FilterPill
                label={vehiclesLabel}
                active={activeTab === TAB_VEHICLES}
                onClick={() => handleTabChange(TAB_VEHICLES)}
              />
              <FilterPill
                label={providersLabel}
                active={activeTab === TAB_PROVIDERS}
                onClick={() => handleTabChange(TAB_PROVIDERS)}
              />
            </Stack>
          </Stack>

          {showTabWiseView(activeTab)}
        </Stack>
      </CustomContainer>
    </>
  );
};

export default RentalWishListLayout;
