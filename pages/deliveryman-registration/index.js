import { NoSsr } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getImageUrl } from "utils/CustomFunctions";

import { getServerSideProps } from "../index";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import DeliveryComponent from "../../src/components/deliveryman-registration/ DeliveryManComponent";
import DeliveryManComponent from "../../src/components/deliveryman-registration/ DeliveryManComponent";
import useScrollToTop from "../../src/api-manage/hooks/custom-hooks/useScrollToTop";
const Index = ({ configData, landingPageData }) => {
  const router = useRouter();

  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `Deliveryman Registration` : "Loading..."}
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
          <CustomContainer>
            <DeliveryManComponent
              configData={configData}
              landingPageData={landingPageData}
            />
          </CustomContainer>
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;

export { getServerSideProps };
