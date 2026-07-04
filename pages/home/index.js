import CssBaseline from "@mui/material/CssBaseline";
import Router, { useRouter } from "next/router";
import React, { useEffect } from "react";
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
  const router = useRouter();
  const selectedModule = useSelector(
    (state) => state.utilsData?.selectedModule
  );
  const queryModuleType =
    typeof router.query.module === "string" ? router.query.module : null;
  const currentModuleType =
    selectedModule?.module_type ??
    getCurrentModuleType() ??
    queryModuleType ??
    null;
  const isRideModule = currentModuleType === ModuleTypes.RIDE;

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
  console.log({ metaData, configData });

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

      <MainLayout configData={configData} landingPageData={dataLanding}>
        <ModuleWiseLayout
          configData={configData}
          landingPageData={dataLanding}
        />
      </MainLayout>
      {!isRideModule && <AiChatBotLauncher />}
    </>
  );
};

export default Home;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "home_page");
};
Home.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;
