import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { setConfigData } from "redux/slices/configData";
import { setSelectedModule } from "redux/slices/utils";
import { config_api } from "api-manage/ApiRoutes";
import { provider_details_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import MainLayout from "components/layout/MainLayout";
import SEO from "components/seo";
import { checkMaintenanceMode } from "utils/serverSidePropsHelper";
import fetchWithTimeoutRetry from "utils/fetchWithTimeoutRetry";
import StoreDetailsSkeleton from "components/common/skeletons/StoreDetailsSkeleton";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { saveModuleParam } from "utils/moduleParamManager";

const ProviderDetails = dynamic(
  () =>
    import(
      "components/home/module-wise-components/service/components/provider-details"
    ),
  { ssr: false, loading: () => <StoreDetailsSkeleton /> },
);

const StorePage = ({ configData, providerDetails, distance }) => {
  const dispatch = useDispatch();
  useScrollToTop();

  const metaTitle = `${
    providerDetails?.meta_title || providerDetails?.name
  } - ${configData?.business_name}`;
  const metaImage =
    providerDetails?.meta_image_full_url || configData?.logo_full_url;

  const manageVisitedStores = () => {
    const key = "visitedStores";
    try {
      const stored = localStorage.getItem(key);
      const visitedStores = stored ? JSON.parse(stored) : [];

      const alreadyVisited = visitedStores.some(
        (store) => store?.id === providerDetails?.id,
      );
      if (!alreadyVisited) {
        visitedStores.push({ ...providerDetails, distance });
        localStorage.setItem(key, JSON.stringify(visitedStores));
      }
    } catch {
      // do nothing on error
    }
  };

  useEffect(() => {
    if (providerDetails) {
      manageVisitedStores();
    }
  }, [providerDetails?.id]);

  useEffect(() => {
    if (configData && Object.keys(configData).length > 0) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);

  useEffect(() => {
    const mod = providerDetails?.module;
    if (mod && !getCurrentModuleType()) {
      localStorage.setItem("module", JSON.stringify(mod));
      saveModuleParam(mod.id, mod.slug);
      dispatch(setSelectedModule(mod));
    }
  }, [providerDetails?.module?.id]);
  return (
    <>
      <CssBaseline />
      <SEO
        title={metaTitle}
        image={metaImage}
        businessName={configData?.business_name}
        description={providerDetails?.meta_description}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <ProviderDetails
          providerDetails={providerDetails}
          configData={configData}
        />
      </MainLayout>
    </>
  );
};

export default StorePage;

export const getServerSideProps = async (context) => {
  const { id: storeId, lat, lng, zone_id, distance } = context.query;
  const { req, res } = context;
  const language = req.cookies.languageSetting || "en";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const origin = process.env.NEXT_CLIENT_HOST_URL;

  const headersCommon = {
    "X-software-id": 33571750,
    "X-server": "server",
    origin,
    "X-localization": language,
  };

  const moduleId = req.cookies?.selectedModuleId;

  console.time("Fetch Config + Store Details");
  const [configSettled, providerDetailsSettled] = await Promise.allSettled([
    fetchWithTimeoutRetry(`${baseUrl}${config_api}`, {
      method: "GET",
      headers: { ...headersCommon, lat, lng },
    }),
    fetchWithTimeoutRetry(`${baseUrl}${provider_details_api}/${storeId}`, {
      method: "GET",
      headers: { ...headersCommon, ...(moduleId && { moduleId }) },
    }),
  ]);
  console.timeEnd("Fetch Config + Store Details");

  // configData powers the header/layout/business info — it must always load, no graceful degrade.
  if (configSettled.status === "rejected") {
    console.log("config network error 🔥", configSettled.reason?.message);
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
    console.log("config parse error 🔥", error.message);
    return { notFound: true };
  }

  // providerDetails can gracefully degrade to null on a pure network/timeout failure.
  let providerDetails = null;
  if (providerDetailsSettled.status === "rejected") {
    console.log(
      "provider_details network error 🔥",
      providerDetailsSettled.reason?.message,
    );
  } else {
    const providerDetailsRes = providerDetailsSettled.value;
    if (!providerDetailsRes.ok) {
      return { notFound: true };
    }
    try {
      providerDetails = await providerDetailsRes.json();
    } catch (error) {
      console.log("provider_details parse error 🔥", error.message);
      return { notFound: true };
    }
    if (!providerDetails?.id) {
      console.log("provider_details failed 🔥", { providerDetails });
      return { notFound: true };
    }
  }

  if (checkMaintenanceMode(configData)) {
    return {
      redirect: {
        destination: "/maintainance",
        permanent: false,
      },
    };
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );
  return {
    props: {
      configData,
      providerDetails,
      distance: distance || null,
    },
  };
};
