import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import AuthGuard from "../../src/components/route-guard/AuthGuard";
import { useRouter } from "next/router";
import ReviewPage from "../../src/components/review";
import SEO from "../../src/components/seo";
import { getServerSideProps } from "../index";
import CustomContainer from "../../src/components/container";
import { getImageUrl } from "utils/CustomFunctions";

const Index = ({ configData, landingPageData }) => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <SEO
        title={configData ? `Review` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <CssBaseline />
      <AuthGuard from={router.pathname.replace("/", "")}>
        <MainLayout configData={configData} landingPageData={landingPageData}>
          <CustomContainer>
            <ReviewPage id={id} />
          </CustomContainer>
        </MainLayout>
      </AuthGuard>
    </>
  );
};

export default Index;
export { getServerSideProps };
