import React from "react";
import MainLayout from "../../../src/components/layout/MainLayout";

import CssBaseline from "@mui/material/CssBaseline";
import dynamic from "next/dynamic";
import { getServerSideProps } from "../../index";
import SEO from "../../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";

const Index = ({ configData, landingPageData }) => {
  const SignUp = dynamic(
    () => import("../../../src/components/auth/sign-up/SignUp"),
    {
      ssr: false,
    }
  );

  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `Sign Up` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <SignUp configData={configData} />
      </MainLayout>
    </>
  );
};

export default Index;

export { getServerSideProps };
