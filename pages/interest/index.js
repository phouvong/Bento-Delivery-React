import React, { useEffect } from "react";
import ZoneGuard from "../../src/components/route-guard/ZoneGuard";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import InterestOptions from "../../src/components/interest/InterestOptions";
import { getServerSideProps } from "../index";
import CustomContainer from "../../src/components/container";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../src/redux/slices/configData";

const Index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!configData) {
      configRefetch();
    }
  }, [configData]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (dataConfig) {
      dispatch(setConfigData(dataConfig));
    }
  }, [dataConfig]);
  return (
    <>
      <CssBaseline />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <CustomContainer>
          <InterestOptions configData={configData} />
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;
Index.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;
export { getServerSideProps };
