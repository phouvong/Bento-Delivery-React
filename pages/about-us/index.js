import { useTranslation } from "react-i18next";
import useGetPolicyPage from "../../src/api-manage/hooks/react-query/useGetPolicyPage";
import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import PolicyPage from "../../src/components/policy-page";
import SEO from "../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";
import { fetchPageMetadata, processMetadata } from "utils/fetchPageMetaData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";

const Index = ({ configData, metaData }) => {
  const { t } = useTranslation();
  const { data, refetch, isFetching } = useGetPolicyPage("/api/v1/about-us");
  const metadata = processMetadata(metaData, {
        title: `About us - ${configData?.business_name}`,
        description: '',
        image:  configData?.logo_full_url,
       
    })

  useEffect(() => {
    if (refetch) refetch();
  }, [refetch]);

  if (!configData) {
    return <div>{t("Configuration data is not available")}</div>;
  }
  console.log({metadata,configData});
  

  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata.title}
        description={metadata.description}
        image={metadata?.image}
        robotsMeta={metadata.robotsMeta}
      />
      <MainLayout configData={configData} >
        <PolicyPage data={data} title={t("About us")} isFetching={isFetching} />
      </MainLayout>
    </>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, 'about_us_page')
}

