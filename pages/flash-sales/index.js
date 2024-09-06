import { CssBaseline } from "@mui/material";
import React from "react";
import SEO from "../../src/components/seo";
import MainLayout from "../../src/components/layout/MainLayout";
import FlashSales from "../../src/components/flash-sales";
import { getServerSideProps } from "../index";
import { getImageUrl } from "utils/CustomFunctions";

const FlashSalesPage = ({ configData, landingPageData }) => {
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
export { getServerSideProps };
