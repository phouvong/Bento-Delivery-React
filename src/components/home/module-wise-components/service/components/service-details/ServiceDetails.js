import {
  Box,
  Grid,
  IconButton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import SinglePoster from "components/home/module-wise-components/ecommerce/SinglePoster";
import ServiceDetailsSection from "./ServiceDetailsSection";
import StoreDetails from "./StoreDetails";
import RelatedProviderServices from "./RelatedProviderServices";
import FeaturedStores from "components/home/module-wise-components/pharmacy/featured-stores";
import ServiceDescription from "./ServiceDescription";
import ServiceReviewsSection from "./ServiceReviewsSection";
import ServiceFaq from "./ServiceFaq";

const ServiceProductDetails = ({ serviceDetailsData, configData }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { cartList: aliasCartList } = useSelector((state) => state.cart);
  const cartList = getCartListModuleWise(aliasCartList);
  const serviceUpdate = cartList.some(
    (item) => item?.id === serviceDetailsData?.id,
  );
  const titleSentinelRef = useRef(null);
  const [showProductNameInBar, setShowProductNameInBar] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const node = titleSentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowProductNameInBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-60px 0px 0px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    setIsWishlisted(true);
  };

  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    setIsWishlisted(false);
  };

  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";
  const storeName =
    serviceDetailsData?.provider?.name ?? serviceDetailsData?.store_name;
  const providerSlugOrId =
    serviceDetailsData?.provider?.slug || serviceDetailsData?.provider?.id;
  const storeHref = providerSlugOrId
    ? `/service/provider/${providerSlugOrId}${
        moduleParam ? `?module=${moduleParam}` : ""
      }`
    : undefined;

  const breadcrumbItems = [
    {
      key: "home",
      label: t("Home"),
      icon: (
        <i
          className="fi fi-rr-home"
          style={{ fontSize: 12, display: "flex", lineHeight: 1 }}
        />
      ),
      onRedirect: homeHref,
    },
    ...(storeName
      ? [
          {
            key: "store",
            label: storeName,
            ...(storeHref ? { onRedirect: storeHref } : {}),
          },
        ]
      : []),
    {
      key: "product",
      label: serviceDetailsData?.name,
    },
  ];

  return (
    <CustomStackFullWidth
      paddingTop={{ xs: 0, md: "2.5rem" }}
      //paddingBottom="2.5rem"
      //sx={{ minHeight: "100vh" }}
    >
      {/* Mobile-only fixed top bar with back arrow + dynamic title */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          alignItems: "center",
          gap: 1,
          height: 52,
          px: 1.5,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 2px 6px ${alpha(theme.palette.text.primary, 0.04)}`,
        }}
      >
        <IconButton
          onClick={() => router.back()}
          size="small"
          aria-label={t("Back")}
          sx={{ color: theme.palette.text.primary }}
        >
          <i
            className="fi fi-rr-arrow-small-left"
            style={{ fontSize: "18px", display: "flex", lineHeight: 1 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "16px",
            color: theme.palette.text.primary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
            minWidth: 0,
          }}
        >
          {showProductNameInBar
            ? serviceDetailsData?.name
            : t("Service Details")}
        </Typography>
      </Box>

      {/* Spacer so content isn't hidden under the fixed bar on mobile */}
      <Box sx={{ display: { xs: "block", md: "none" }, height: 52 }} />

      <CustomStackFullWidth
        sx={{
          px: { xs: 1.5, sm: 3, lg: 0 },
          py: { xs: 1.5, sm: 0, lg: 0 },
          mb: { xs: 1.25, md: 2 },
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "& nav": {
            flexWrap: "nowrap",
            minWidth: "max-content",
          },
          "& nav span": {
            fontSize: { xs: "13px", md: "16px" },
          },
        }}
      >
        <CustomPageBreadCrumb items={breadcrumbItems} />
      </CustomStackFullWidth>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={8}>
          <CustomStackFullWidth spacing={3}>
            <Box>
              <Box ref={titleSentinelRef} sx={{ height: 0 }} />
              <ServiceDetailsSection
                serviceDetailsData={serviceDetailsData}
                configData={configData}
                addToWishlistHandler={addToWishlistHandler}
                removeFromWishlistHandler={removeFromWishlistHandler}
                isWishlisted={isWishlisted}
                serviceUpdate={serviceUpdate}
              />
            </Box>
            <ServiceDescription
              description={serviceDetailsData?.long_description}
              serviceDetailsData={serviceDetailsData}
            />
            <ServiceReviewsSection
              serviceId={serviceDetailsData?.id}
              reviews={serviceDetailsData?.reviews ?? []}
              storename={
                serviceDetailsData?.provider?.name ??
                serviceDetailsData?.store_name
              }
            />
            <ServiceFaq faqs={serviceDetailsData?.faqs} />
            <CustomStackFullWidth>
              <FeaturedStores slide={3.2} title="Popular Stores" />
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomStackFullWidth spacing={3}>
            <StoreDetails storeDetails={serviceDetailsData?.provider} />
            <CustomStackFullWidth sx={{ display: { xs: "none", md: "block" } }}>
              <RelatedProviderServices productDetails={serviceDetailsData} />
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </Grid>

        <Grid item xs={12} sx={{ display: { xs: "block", md: "none" } }}>
          <RelatedProviderServices productDetails={serviceDetailsData} />
        </Grid>

        <Grid item xs={12}>
          <SinglePoster />
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

export default ServiceProductDetails;
