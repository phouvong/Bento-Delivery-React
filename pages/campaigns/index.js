import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import CampaignsPage from "../../src/components/Campaigns";
import { getServerSideProps } from "../index";
import SEO from "../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";

const Index = ({ configData, landingPageData }) => {
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `Campaigns` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <CampaignsPage />
      </MainLayout>
    </>
  );
};

export default Index;
export { getServerSideProps };
