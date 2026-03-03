import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import PolicyPage from "../../src/components/policy-page";
import useGetPolicyPage from "../../src/api-manage/hooks/react-query/useGetPolicyPage";
import SEO from "../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";

const Index = ({ configData ,metaData}) => {
  const { t } = useTranslation();
  const metadata = processMetadata(metaData, {
    title: metaData?.title ||` refund policy - ${configData?.business_name}`,
    description: metaData?.description || '',
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || ''
  })

  // Fetch refund policy data
  const { data, refetch, isFetching } = useGetPolicyPage(
    "/api/v1/refund-policy"
  );

  // Refetch data on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Render fallback UI if configData is missing
  if (!configData) {
    return <div>{t("Configuration data is not available")}</div>;
  }

  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        robotsMeta={metadata.robotsMeta}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <PolicyPage
          data={data}
          title={t("Refund Policy")}
          isFetching={isFetching}
        />
      </MainLayout>
    </>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, 'refund_policy_page')
}