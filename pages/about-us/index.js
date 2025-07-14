import { useTranslation } from "react-i18next";
import useGetPolicyPage from "../../src/api-manage/hooks/react-query/useGetPolicyPage";
import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import PolicyPage from "../../src/components/policy-page";
import SEO from "../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";

const Index = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  const { data, refetch, isFetching } = useGetPolicyPage("/api/v1/about-us");

  useEffect(() => {
    if (refetch) refetch();
  }, [refetch]);

  if (!configData) {
    return <div>{t("Configuration data is not available")}</div>;
  }

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
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <PolicyPage data={data} title={t("About us")} isFetching={isFetching} />
      </MainLayout>
    </>
  );
};

export default Index;

export const getStaticProps = async () => {
  try {
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
        configData: config,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching config data:", error);

    return {
      props: {
        configData: null,
      },
      revalidate: 3600,
    };
  }
};
