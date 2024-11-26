import CssBaseline from "@mui/material/CssBaseline";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import Router, { useRouter } from "next/router";
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

const CheckOutPage = () => {
  useScrollToTop();
  const dispatch = useDispatch();
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
  const router = useRouter();
  const { page, store_id, id } = router.query;
  const {
    cartList: aliasCartList,
    campaignItemList,
    buyNowItemList,
    totalAmount,
  } = useSelector((state) => state.cart);
  const cartList = getCartListModuleWise(aliasCartList);
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
        <CustomContainer>
          <AuthGuard from="checkout">
            {page === "parcel" && <ParcelCheckout configData={configData} />}
            {page === "prescription" && (
              <PrescriptionCheckout
                storeId={store_id}
                configData={configData}
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
            <RedirectWhenCartEmpty
              page={page}
              cartList={aliasCartList}
              campaignItemList={campaignItemList}
              buyNowItemList={buyNowItemList}
            />
          </AuthGuard>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default CheckOutPage;
