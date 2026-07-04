import CssBaseline from "@mui/material/CssBaseline";
import NoSsr from "@mui/material/NoSsr";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import Router, { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PrescriptionCheckout from "../../src/components/checkout/Prescription";
import RedirectWhenCartEmpty from "../../src/components/checkout/RedirectWhenCartEmpty";
import ItemCheckout from "../../src/components/checkout/item-checkout";
import ParcelCheckout from "../../src/components/checkout/parcel";
import CustomContainer from "../../src/components/container";
import MainLayout from "../../src/components/layout/MainLayout";
import AuthGuard from "../../src/components/route-guard/AuthGuard";
import SEO from "../../src/components/seo";
import { getServerSideProps } from "../index";
import { getImageUrl } from "utils/CustomFunctions";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import { setConfigData } from "redux/slices/configData";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import useGetLandingPage from "../../src/api-manage/hooks/react-query/useGetLandingPage";

const CheckoutMobileHeader = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{ px: "12px", py: "12px" }}
      >
        <IconButton
          onClick={() => router.back()}
          sx={{ p: "4px", color: "neutral.1050", flexShrink: 0 }}
        >
          <i
            className="fi fi-rr-arrow-small-left"
            style={{ fontSize: "22px", lineHeight: 1, display: "flex" }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.54px",
            lineHeight: 1.1,
          }}
        >
          {t("Checkout")}
        </Typography>
      </Stack>
    </Box>
  );
};

const CheckOutPage = () => {
  useScrollToTop();
  const dispatch = useDispatch();
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
  const router = useRouter();
  const { page, store_id, id, incomplete_payment } = router.query;
  const {
    cartList: aliasCartList,
    campaignItemList,
    buyNowItemList,
    totalAmount,
  } = useSelector((state) => state.cart);

  // Rental items live in cartList alongside food/grocery/etc., but the
  // rental flow has its own dedicated /rental/cart and /rental/checkout
  // pages. Drop rental items here so they can't leak into the regular
  // home cart/checkout screens (e.g. if getCurrentModuleId() lags after a
  // module switch).
  const nonRentalCartList = aliasCartList?.filter(
    (item) => item?.module_type !== "rental"
  );
  const moduleCartList = getCartListModuleWise(nonRentalCartList);
  const cartList = store_id
    ? moduleCartList.filter((item) => {
        const itemStoreId = item?.store_id ?? item?.store?.id;
        return String(itemStoreId) === String(store_id);
      })
    : moduleCartList;
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();
  useEffect(() => {
    if (!configData) {
      configRefetch();
    }
  }, [configData]);
  useEffect(() => {
    if (dataConfig) {
      dispatch(setConfigData(dataConfig));
    }
  }, [dataConfig]);
  return (
    <>
      <CssBaseline />
      <SEO
        configData={configData}
        title={configData ? `Checkout` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />

      <MainLayout configData={configData} landingPageData={landingPageData}>
        <CheckoutMobileHeader />
        <CustomContainer>
          <NoSsr>
            {page === "parcel" && <ParcelCheckout configData={configData} />}
            {page === "prescription" && (
              <PrescriptionCheckout
                storeId={store_id}
                configData={configData}
                page={page}
              />
            )}
            {page === "campaign" && campaignItemList.length > 0 && (
              <ItemCheckout
                router={router}
                configData={configData}
                page={page}
                cartList={cartList}
                campaignItemList={campaignItemList}
                totalAmount={totalAmount}
              />
            )}
            {page === "cart" && (
              <ItemCheckout
                router={router}
                configData={configData}
                page={page}
                cartList={cartList}
                campaignItemList={campaignItemList}
                totalAmount={totalAmount}
              />
            )}
            {page === "buy_now" && buyNowItemList.length > 0 && (
              <ItemCheckout
                router={router}
                configData={configData}
                page={page}
                cartList={buyNowItemList}
                campaignItemList={campaignItemList}
                totalAmount={totalAmount}
              />
            )}
            {!incomplete_payment && (
              <RedirectWhenCartEmpty
                page={page}
                cartList={aliasCartList}
                campaignItemList={campaignItemList}
                buyNowItemList={buyNowItemList}
              />
            )}
          </NoSsr>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default CheckOutPage;
