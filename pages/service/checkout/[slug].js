import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../../src/components/layout/MainLayout";
import SEO from "../../../src/components/seo";
import { useDispatch, useSelector } from "react-redux";
import { NoSsr } from "@mui/material";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import { useEffect } from "react";
import { useGetConfigData } from "../../../src/api-manage/hooks/useGetConfigData";
import ServiceCheckoutPage from "../../../src/components/home/module-wise-components/service/components/service-checkout/ServiceCheckoutPage";
import { setConfigData } from "../../../src/redux/slices/configData";
import { useRouter } from "next/router";
import useGetCustomServiceRequestDetails from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/custom-service/useGetCustomServiceRequestDetails";

const CustomServiceCheckout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug, reqServiceId } = router.query;

  const { landingPageData, configData } = useSelector(
    (state) => state.configData,
  );

  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  const { data: requestedServiceDetails } = useGetCustomServiceRequestDetails({
    id: reqServiceId,
    enabled: !!reqServiceId,
  });

  useEffect(() => {
    if (slug && slug !== "custom-service") {
      router.replace("/");
    }
  }, [slug, router]);

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

  if (!slug || slug !== "custom-service") return null;

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
          <ServiceCheckoutPage
            slug="custom-service"
            reqServiceDetails={requestedServiceDetails}
          />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default CustomServiceCheckout;
