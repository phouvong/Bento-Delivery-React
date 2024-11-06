import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import PolicyPage from "../../src/components/policy-page";
import useGetPolicyPage from "../../src/api-manage/hooks/react-query/useGetPolicyPage";
import { getServerSideProps } from "../index";
import SEO from "../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";
import StoreRegistration from "../../src/components/store-resgistration";
import useScrollToTop from "../../src/api-manage/hooks/custom-hooks/useScrollToTop";
import { NoSsr } from "@mui/material";

const Index = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `Store registration` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <NoSsr>
          <StoreRegistration />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;
export { getServerSideProps };
