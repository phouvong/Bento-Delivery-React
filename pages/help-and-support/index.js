import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import HelpAndSupport from "../../src/components/help-and-support";
import { useTranslation } from "react-i18next";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import { getImageUrl } from "utils/CustomFunctions";
import { fetchPageMetadata, processMetadata } from "utils/fetchPageMetaData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";

const Index = ({ configData ,metaData}) => {
  const { t } = useTranslation();
  const metadata = processMetadata(metaData, {
    title: `Help and Support - ${configData?.business_name}`,
    description: metaData?.description || '',
    image: `${metaData?.image || configData?.logo_full_url}`,
     robotsMeta: metaData?.robotsMeta || ''
  })

  // Handle cases where `configData` is missing
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
      <MainLayout configData={configData} >
        <CustomContainer>
          <HelpAndSupport configData={configData} t={t} />
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
    return await getCommonServerSideProps(context, 'contact_us_page')
}
