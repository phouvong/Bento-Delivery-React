import CssBaseline from "@mui/material/CssBaseline";
import Router from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConfigData } from "redux/slices/configData";
import AiChatBotLauncher from "../../src/components/ai-chatbot/AiChatBotLauncher";
import MainLayout from "../../src/components/layout/MainLayout";
import ModuleWiseLayout from "../../src/components/module-wise-layout";
import ZoneGuard from "../../src/components/route-guard/ZoneGuard";
import SEO from "../../src/components/seo";
import useGetLandingPage from "../../src/api-manage/hooks/react-query/useGetLandingPage";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const Home = ({ metaData, configData }) => {
  const dispatch = useDispatch();
  //const { data: dataConfig, refetch: configRefetch } = useGetConfigData();
  const { data: dataLanding, refetch: refetchLanding } = useGetLandingPage();
  const selectedModule = useSelector(
    (state) => state.utilsData?.selectedModule,
  );
  const [currentModuleType, setCurrentModuleType] = useState(
    selectedModule?.module_type ?? null,
  );
  useEffect(() => {
    setCurrentModuleType(selectedModule?.module_type ?? getCurrentModuleType() ?? null);
  }, [selectedModule?.module_type]);
  const isRideModule = currentModuleType === ModuleTypes.RIDE;
  const isServiceModule = currentModuleType === ModuleTypes.SERVICE;

  const [happyHourActive, setHappyHourActive] = useState(false);
  const handleHappyHourActiveChange = useCallback(
    (active) => setHappyHourActive(active),
    [],
  );

  const metadata = processMetadata(metaData, {
    title: `Home - ${configData?.business_name}`,
    description: metaData?.description || "",
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || "",
  });

  useEffect(() => {
    if (configData) {
      if (configData.length === 0) {
        Router.push("/404");
      } else {
        dispatch(setConfigData(configData));
      }
    }
  }, [configData]);
  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);

  return (
    <>
      <CssBaseline />
      {configData && (
        <SEO
          title={metadata.title}
          description={metadata.description}
          image={metadata.image}
          robotsMeta={metadata.robotsMeta}
          configData={configData}
        />
      )}

      <MainLayout
        configData={configData}
        landingPageData={dataLanding}
        onHappyHourActiveChange={handleHappyHourActiveChange}
      >
        <ModuleWiseLayout
          configData={configData}
          landingPageData={dataLanding}
        />
      </MainLayout>
      {!isRideModule && (
        <AiChatBotLauncher happyHourBannerActive={happyHourActive} />
      )}
    </>
  );
};

export default Home;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "home_page");
};
Home.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;
