import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import PolicyPage from "../../src/components/policy-page";
import useGetPolicyPage from "../../src/api-manage/hooks/react-query/useGetPolicyPage";
import SEO from "../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";

const Index = ({ configData, landingPageData }) => {
  const { t } = useTranslation();

  // Fetch privacy policy data
  const { data, refetch, isFetching, error } = useGetPolicyPage(
    "api/v1/privacy-policy"
  );

  // Refetch data when the component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Handle loading and error states
  if (error) {
    return <div>{t("Failed to load privacy policy. Please try again later.")}</div>;
  }

  if (!configData) {
    return <div>{t("Configuration data is not available.")}</div>;
  }

  return (
    <>
      <CssBaseline />
      <SEO
        title="Privacy Policy"
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon || ""}`}
        businessName={configData?.business_name || ""}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <PolicyPage
          data={data}
          title={t("Privacy Policy")}
          isFetching={isFetching}
        />
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
        landingPageData: {}, // Default landing page data
      },
      revalidate: 3600, // Revalidate every 1 hour
    };
  } catch (error) {
    console.error("Error fetching configuration data:", error);

    return {
      props: {
        configData: null, // Pass null if fetching fails
        landingPageData: {}, // Default landing page data
      },
      revalidate: 3600,
    };
  }
};
