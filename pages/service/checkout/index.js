import CssBaseline from "@mui/material/CssBaseline";

import MainLayout from "../../../src/components/layout/MainLayout";
import SEO from "../../../src/components/seo";

import { useDispatch, useSelector } from "react-redux";

import { NoSsr } from "@mui/material";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGetConfigData } from "../../../src/api-manage/hooks/useGetConfigData";
import ServiceCheckoutPage from "../../../src/components/home/module-wise-components/service/components/service-checkout/ServiceCheckoutPage";
import { setConfigData } from "../../../src/redux/slices/configData";

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
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
        title={configData ? `Checkout` : "Loading..."}
        image={configData?.fav_icon_full_url}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <SimpleMobileHeader title="Checkout" />
        <NoSsr>
          <ServiceCheckoutPage page={router.query.page} />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;
