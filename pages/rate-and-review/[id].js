import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import AuthGuard from "../../src/components/route-guard/AuthGuard";
import { useRouter } from "next/router";
import { getServerSideProps } from "../index";
import RateAndReview from "../../src/components/review/RateAndReview";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import { getImageUrl } from "utils/CustomFunctions";

const Index = ({ configData, landingPageData }) => {
  const router = useRouter();

  return (
    <>
      <SEO
        title={configData ? `Rate and Review` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <CssBaseline />
      <AuthGuard from={router.pathname.replace("/", "")}>
        <MainLayout configData={configData}>
          <CustomContainer>
            <RateAndReview />
          </CustomContainer>
        </MainLayout>
      </AuthGuard>
    </>
  );
  return (
    <>
      <CssBaseline />
      <SEO
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <AuthGuard from={router.pathname.replace("/", "")}>
        <MainLayout configData={configData} landingPageData={landingPageData}>
          <RateAndReview />
        </MainLayout>
      </AuthGuard>
    </>
  );
};

export default Index;
export { getServerSideProps };
