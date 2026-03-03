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

const Index = ({ configData, metaData }) => {
  const metadata = processMetadata(metaData, {
    title: metaData?.title ||`terms - ${configData?.business_name}`,
    description: metaData?.description || '',
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || ''
  })
  const { t } = useTranslation();
  const { data, refetch, isFetching } = useGetPolicyPage(
    "/api/v1/terms-and-conditions"
  );
  useEffect(() => {
    refetch();
  }, []);

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
      <MainLayout configData={configData} >
        <PolicyPage
          data={data}
          title={t("Terms And Conditions")}
          isFetching={isFetching}
        />
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, 'terms_and_conditions_page')
}
