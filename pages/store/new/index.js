import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import TypeWiseStore from "../../../src/components/Store/TypeWiseStore";
import MainLayout from "../../../src/components/layout/MainLayout";
import { processMetadata } from "utils/fetchPageMetaData";
import SEO from "../../../src/components/seo";
import CustomContainer from "../../../src/components/container";
import { CustomStackFullWidth } from "../../../src/styled-components/CustomStyles.style";
import { getImageUrl } from "utils/CustomFunctions";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";

const Index = ({ configData, metaData }) => {
  const metadata = processMetadata(metaData, {
    title: `Latest Stores - ${configData?.business_name}`,
    description: metaData?.description || '',
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || ''
  })
  const { t } = useTranslation();
  const router = useRouter();
  const newText = t("New On");
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
      <MainLayout configData={configData}>
        <CustomContainer>
          <CustomStackFullWidth mt="1rem">
            <TypeWiseStore
              configData={configData}
              t={t}
              storeType="latest"
              title={`${newText} ${configData?.business_name} `}
            />
          </CustomStackFullWidth>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
    return await getCommonServerSideProps(context, 'latest_store_page')
}
