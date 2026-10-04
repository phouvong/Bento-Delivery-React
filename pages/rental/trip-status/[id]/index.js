import CssBaseline from "@mui/material/CssBaseline";

import SEO from "../../../../src/components/seo";
import MainLayout from "../../../../src/components/layout/MainLayout";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { useGetConfigData } from "../../../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../../../src/redux/slices/configData";
import { useEffect } from "react";
import TripStatusPage from "../../../../src/components/home/module-wise-components/rental/components/trip-status/TripStatusPage";
import PushNotificationLayout from "../../../../src/components/PushNotificationLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
  // When opened from the orders rental tab, the card forwards `orderTabModule`.
  // Use it so the (mobile) back button returns to that exact list + tab instead
  // of going home.
  const backHref = router.query.orderTabModule
    ? `/profile?page=my-orders&orderTabModule=${router.query.orderTabModule}`
    : undefined;
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
        title={configData ? `Profile` : "Loading..."}
        image={configData?.fav_icon_full_url}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <SimpleMobileHeader title="Trip Status" backHref={backHref} />
        <PushNotificationLayout>
          <TripStatusPage />
        </PushNotificationLayout>
      </MainLayout>
    </>
  );
};

export default index;
