import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import HelpAndSupport from "../../src/components/help-and-support";
import { useTranslation } from "react-i18next";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import { getImageUrl } from "utils/CustomFunctions";

const Index = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  return (
    <>
      <CssBaseline />
      <SEO
        configData={configData}
        title={configData ? `Help and support` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <CustomContainer>
          <HelpAndSupport configData={configData} t={t} />
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;
export const getStaticProps = async () => {
  // Fetch configuration data
  const configRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const config = await configRes.json();

  return {
    props: {
      configData: config, // Pass configuration data as props
    },
    revalidate: 3600, // Revalidate every 1 hour (3600 seconds)
  };
};
