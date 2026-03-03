import { NoSsr } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect, useState } from "react";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import DeliveryManComponent from "../../src/components/deliveryman-registration/DeliveryManComponent";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";

const Index = ({ metaData }) => {


  const dispatch = useDispatch();
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();
  useEffect(() => {
    if (!configData) {
      configRefetch();
    }
  }, [configData]);
  useEffect(() => {
    if (dataConfig) {
      dispatch(setConfigData(dataConfig));
    }
  }, [dataConfig]);
  const metadata = processMetadata(metaData, {
    title: metaData?.title || `Deliveryman Registration - ${configData?.business_name}`,
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
        <NoSsr>
          <CustomContainer>
            <DeliveryManComponent
              configData={configData}
            />
          </CustomContainer>
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, 'deliveryman_join_page')
}

