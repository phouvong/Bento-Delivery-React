import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import Brands from "../../src/components/home/brands";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";

const Index = ({ configData,metaData, }) => {
  const metadata = processMetadata(metaData, {
    title: `All Brands - ${configData?.business_name}`,
    description: metaData?.description || '',
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || ''
  })
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
        <Brands viewAll />
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
    return await getCommonServerSideProps(context, 'brands_page')
}
