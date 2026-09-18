import CssBaseline from "@mui/material/CssBaseline";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setConfigData } from "redux/slices/configData";
import CustomContainer from "../../../src/components/container";
import MainLayout from "../../../src/components/layout/MainLayout";
import SEO from "../../../src/components/seo";
import {
  service_details_api,
  service_campaign_details_api,
} from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";
import fetchWithTimeoutRetry from "utils/fetchWithTimeoutRetry";
import ProductDetailsSkeleton from "../../../src/components/common/skeletons/ProductDetailsSkeleton";

const ServiceDetails = dynamic(
  () =>
    import(
      "../../../src/components/home/module-wise-components/service/components/service-details/ServiceDetails"
    ),
  { ssr: false, loading: () => <ProductDetailsSkeleton /> },
);

const Index = ({ configData, serviceDetailsData }) => {
  const dispatch = useDispatch();

  const mergedServiceDetailsData = useMemo(() => {
    if (!serviceDetailsData) return serviceDetailsData;
    return {
      ...serviceDetailsData,
      isCampaignService:
        !!(
          serviceDetailsData?.available_time_starts &&
          serviceDetailsData?.available_time_ends
        ) ||
        !!(
          serviceDetailsData?.available_date_starts &&
          serviceDetailsData?.available_date_ends
        ) ||
        false,
    };
  }, [serviceDetailsData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);

  return (
    <>
      <CssBaseline />
      <SEO
        title={serviceDetailsData?.meta_title}
        image={serviceDetailsData?.meta_image}
        businessName={configData?.business_name}
        description={serviceDetailsData?.meta_description}
        configData={configData}
        robotsMeta={serviceDetailsData?.meta_data}
      />
      <MainLayout configData={configData}>
        <CustomContainer sx={{ mt: { xs: "0", md: "20px" } }}>
          <ServiceDetails
            serviceDetailsData={mergedServiceDetailsData}
            configData={configData}
          />
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  const { req, res, query } = context;
  const language = req.cookies.languageSetting || "en";
  const serviceId = query.id;
  const moduleId = req.cookies?.selectedModuleId;
  const isCampaign = query.campaign === "1";
  const serviceDetailsUrl = isCampaign
    ? `${service_campaign_details_api}/${serviceId}`
    : `${service_details_api}/${serviceId}`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const origin = process.env.NEXT_CLIENT_HOST_URL;

  console.time("Fetch Config + Service Details");
  const [configSettled, serviceDetailsSettled] = await Promise.allSettled([
    fetchWithTimeoutRetry(`${baseUrl}/api/v1/config`, {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        origin,
        "X-localization": language,
      },
    }),
    fetchWithTimeoutRetry(`${baseUrl}${serviceDetailsUrl}`, {
      method: "GET",
      headers: {
        moduleId: moduleId,
        "X-localization": language,
      },
    }),
  ]);
  console.timeEnd("Fetch Config + Service Details");

  // configData powers the header/layout/business info — it must always load, no graceful degrade.
  if (configSettled.status === "rejected") {
    console.error("config network error:", configSettled.reason?.message);
    return { notFound: true };
  }
  const configRes = configSettled.value;
  if (!configRes.ok) {
    return { notFound: true };
  }

  let configData;
  try {
    configData = await configRes.json();
  } catch (error) {
    console.error("config parse error:", error.message);
    return { notFound: true };
  }

  // serviceDetailsData can gracefully degrade to null on a pure network/timeout failure.
  let serviceDetailsData = null;
  if (serviceDetailsSettled.status === "rejected") {
    console.error(
      "service_details network error:",
      serviceDetailsSettled.reason?.message,
    );
  } else {
    const serviceDetailsRes = serviceDetailsSettled.value;
    if (!serviceDetailsRes.ok) {
      return { notFound: true };
    }
    try {
      serviceDetailsData = await serviceDetailsRes.json();
    } catch (error) {
      console.error("service_details parse error:", error.message);
      return { notFound: true };
    }
    if (serviceDetailsData?.errors?.message) {
      return { notFound: true };
    }
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );

  return {
    props: {
      configData,
      serviceDetailsData,
    },
  };
};
