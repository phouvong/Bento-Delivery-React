import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import SEO from "../../../../src/components/seo";
import {useTranslation} from "react-i18next";
import MainLayout from "../../../../src/components/layout/MainLayout";
import {PageDetailsWrapper} from "../../../../src/styled-components/CustomStyles.style";
import CustomContainer from "../../../../src/components/container";
import TypeWiseStore from "../../../../src/components/Store/TypeWiseStore";
import {getCurrentModuleType} from "../../../../src/helper-functions/getCurrentModuleType";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";


const Index = ({ configData, metaData }) => {
const metadata = processMetadata(metaData, {
    title: `Popular Stores - ${configData?.business_name}`,
    description: metaData?.description || '',
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || ''
  })
  const { t } = useTranslation();
  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata.title}
        image={metadata.image}
        businessName={configData?.business_name}
        description={metadata.description}
        robotsMeta={metadata.robotsMeta}
      />
      <MainLayout configData={configData}>
        <PageDetailsWrapper>
          <CustomContainer>
            <TypeWiseStore
              configData={configData}
              t={t}
              storeType="popular"
              title={getCurrentModuleType() === "rental"?"Popular Providers":"Popular Stores"}
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

