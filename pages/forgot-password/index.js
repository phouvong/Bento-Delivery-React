import React from "react";
import ForgotPassword from "../../src/components/auth/ForgotPassword/ForgotPassword";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo";
import { getServerSideProps } from "../index";
import { NoSsr } from "@mui/material";
import { getImageUrl } from "utils/CustomFunctions";

const index = ({ configData, landingPageData }) => {
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `Forgot password` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <NoSsr>
          <ForgotPassword />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;
export { getServerSideProps };
