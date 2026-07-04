import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import dynamic from "next/dynamic";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";

const AllStores = dynamic(() => import("../../src/components/all-stores"), {
  ssr: false,
});

const Index = ({ configData, metaData }) => {
  const metadata = processMetadata(metaData, {
    title: `All Stores - ${configData?.business_name ?? ""}`,
    description: metaData?.description || "",
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || "",
  });
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
        <CustomContainer sx={{ mt: { xs: "0", md: "34px" } }}>
          <AllStores />
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "stores_page");
};
