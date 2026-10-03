import { CssBaseline } from "@mui/material";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../../src/components/seo";
import MainLayout from "../../src/components/layout/MainLayout";
import BogoListPage from "../../src/components/bogo-list";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../src/redux/slices/configData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const BOGO_ALLOWED_MODULES = ["food", "grocery", "pharmacy", "ecommerce"];

const BogoListPageWrapper = ({ configData, metaData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const metadata = processMetadata(metaData, {
    title: `BOGO Offer - ${configData?.business_name}`,
    description: metaData?.description || "",
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || "",
  });
  const { configData: storeConfigData } = useSelector(
    (state) => state.configData,
  );
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    const moduleType = getCurrentModuleType();
    if (moduleType && !BOGO_ALLOWED_MODULES.includes(moduleType)) {
      router.replace("/home");
    }
  }, []);

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

  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata?.title}
        image={metadata?.image}
        description={metadata?.description}
        robotsMeta={metadata?.robotsMeta}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <BogoListPage />
      </MainLayout>
    </>
  );
};

export default BogoListPageWrapper;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "bogo_list");
};
