import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { useTranslation } from "react-i18next";
import TypeWiseStore from "../../../src/components/Store/TypeWiseStore";
import MainLayout from "../../../src/components/layout/MainLayout";
import SEO from "../../../src/components/seo";
import { PageDetailsWrapper } from "../../../src/styled-components/CustomStyles.style";
import CustomContainer from "../../../src/components/container";
import { NoSsr } from "@mui/material";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";

const Index = ({ configData,metaData  }) => {
  const metadata = processMetadata(metaData, {
    title: `Top offers near me - ${configData?.business_name}`,
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
        description={metadata.description}
        image={metadata.image}
        robotsMeta={metadata.robotsMeta}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <PageDetailsWrapper>
          <CustomContainer>
            <NoSsr>
              <TypeWiseStore
                configData={configData}
                t={t}
                storeType="top_offer_near_me"
                title="Top offers near me"
              />
            </NoSsr>
          </CustomContainer>
        </PageDetailsWrapper>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
    return await getCommonServerSideProps(context, 'top_offers_page')
}

