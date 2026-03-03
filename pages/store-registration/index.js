import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo"
import StoreRegistration from "../../src/components/store-resgistration";
import { NoSsr } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../src/redux/slices/configData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";

const Index = ({metaData}) => {
  
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
    title: metaData?.title ||`Store Registration - ${configData?.business_name}`,
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
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <NoSsr>
          <StoreRegistration />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, 'store_join_page')
}

