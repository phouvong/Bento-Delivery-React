import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import TypeWiseStore from "../../../src/components/Store/TypeWiseStore";
import MainLayout from "../../../src/components/layout/MainLayout";
import SEO from "../../../src/components/seo";
import { PageDetailsWrapper } from "../../../src/styled-components/CustomStyles.style";
import CustomContainer from "../../../src/components/container";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";

const Index = ({ configData, metaData }) => {
  const { t } = useTranslation();
  const metadata = processMetadata(metaData, {
    title: `Popular Stores - ${configData?.business_name}`,
    description: metaData?.description || '',
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || ''
  })
  const router = useRouter();
  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata.title}
        image={metadata.image}
        description={metadata.description}
        robotsMeta={metadata.robotsMeta}
        configData={configData}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} >
        <PageDetailsWrapper>
          <CustomContainer>
            <TypeWiseStore
              configData={configData}
              t={t}
              storeType="popular"
              title="Popular Stores"
            />
          </CustomContainer>
        </PageDetailsWrapper>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
    return await getCommonServerSideProps(context, 'popular_store_page')
}
