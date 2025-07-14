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

  // Handle cases where `configData` is missing
  if (!configData) {
    return <div>{t("Configuration data is not available")}</div>;
  }

  return (
    <>
      <CssBaseline />
      <SEO
        configData={configData}
        title="Help and Support"
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
  try {
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

    if (!configRes.ok) {
      throw new Error(`Failed to fetch config: ${configRes.statusText}`);
    }

    const config = await configRes.json();

    return {
      props: {
        configData: config, // Pass configuration data as props
        landingPageData: {}, // Provide a default or fetch landing page data if needed
      },
      revalidate: 3600, // Revalidate every 1 hour (3600 seconds)
    };
  } catch (error) {
    console.error("Error fetching config data:", error);

    return {
      props: {
        configData: null, // Return null configData on error
        landingPageData: {}, // Provide fallback data
      },
      revalidate: 3600,
    };
  }
};
