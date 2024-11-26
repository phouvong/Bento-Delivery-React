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
  const { data, refetch, isFetching } = useGetPolicyPage(
    "api/v1/privacy-policy"
  );
  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `Privacy Policy` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
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
