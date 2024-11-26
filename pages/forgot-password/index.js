import { NoSsr } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect } from "react";
import { getImageUrl } from "utils/CustomFunctions";
import ForgotPassword from "../../src/components/auth/ForgotPassword/ForgotPassword";
import MainLayout from "../../src/components/layout/MainLayout";
import SEO from "../../src/components/seo";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../src/redux/slices/configData";

const index = () => {
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
      <SEO
        title={configData ? `Forgot password` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <NoSsr>
          <ForgotPassword configData={configData} />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;
