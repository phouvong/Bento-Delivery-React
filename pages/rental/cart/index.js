import CssBaseline from "@mui/material/CssBaseline";

import SEO from "../../../src/components/seo";
import MainLayout from "../../../src/components/layout/MainLayout";

import { useDispatch, useSelector } from "react-redux";

import { useGetConfigData } from "../../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../../src/redux/slices/configData";
import { useEffect } from "react";
import RentalCartPage from "../../../src/components/home/module-wise-components/rental/components/rental-cart/RentalCartPage";
import { NoSsr } from "@mui/material";

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
        title={configData ? `Cart` : "Loading..."}
        image={configData?.fav_icon_full_url}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <NoSsr>
          <RentalCartPage />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;
