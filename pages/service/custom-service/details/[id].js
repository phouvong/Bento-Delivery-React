import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../../../src/components/layout/MainLayout";
import SEO from "../../../../src/components/seo";
import { useDispatch, useSelector } from "react-redux";
import { NoSsr } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useGetConfigData } from "../../../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../../../src/redux/slices/configData";
import { getToken } from "../../../../src/helper-functions/getToken";
import CustomServiceDetails from "components/home/module-wise-components/service/components/custom-service/details";
import PushNotificationLayout from "components/PushNotificationLayout";

const CustomServiceDetailsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/auth/sign-in");
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
        title={configData ? "Custom Service Details" : "Loading..."}
        image={configData?.fav_icon_full_url}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <NoSsr>
          <PushNotificationLayout pathName="profile">
            <CustomServiceDetails configData={configData} serviceId={id} />
          </PushNotificationLayout>
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default CustomServiceDetailsPage;
