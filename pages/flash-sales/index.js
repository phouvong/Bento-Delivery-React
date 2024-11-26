import { CssBaseline } from "@mui/material";
import React, { useEffect } from "react";
import SEO from "../../src/components/seo";
import MainLayout from "../../src/components/layout/MainLayout";
import FlashSales from "../../src/components/flash-sales";
import { getImageUrl } from "utils/CustomFunctions";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../src/redux/slices/configData";

const FlashSalesPage = () => {
  const dispatch = useDispatch();
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
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
        title={configData ? `Flash Sale` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <FlashSales />
      </MainLayout>
    </>
  );
};

export default FlashSalesPage;
