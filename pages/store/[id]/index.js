import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../../src/components/layout/MainLayout";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { setConfigData } from "redux/slices/configData";
import { config_api, store_details_api } from "api-manage/ApiRoutes";
import SEO from "../../../src/components/seo";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import { checkMaintenanceMode } from "../../../src/utils/serverSidePropsHelper";
import fetchWithTimeoutRetry from "../../../src/utils/fetchWithTimeoutRetry";
import StoreDetailsSkeleton from "../../../src/components/common/skeletons/StoreDetailsSkeleton";

const StoreDetails = dynamic(
  () => import("../../../src/components/store-details"),
  { ssr: false, loading: () => <StoreDetailsSkeleton /> }
);

const StorePage = ({ configData, storeDetails, distance }) => {
  const dispatch = useDispatch();
  useScrollToTop();

  const metaTitle = `${storeDetails?.meta_title || storeDetails?.name} - ${
    configData?.business_name
  }`;
  const metaImage =
    storeDetails?.meta_image_full_url || configData?.logo_full_url;

  const manageVisitedStores = () => {
    const key = "visitedStores";
    try {
      const stored = localStorage.getItem(key);
      const visitedStores = stored ? JSON.parse(stored) : [];

      const alreadyVisited = visitedStores.some(
        (store) => store?.id === storeDetails?.id
      );
      if (!alreadyVisited) {
        visitedStores.push({ ...storeDetails, distance });
        localStorage.setItem(key, JSON.stringify(visitedStores));
      }
    } catch {
      // do nothing on error
    }
  };

  useEffect(() => {
    if (storeDetails) {
      manageVisitedStores();
    }
  }, [storeDetails?.id]);

  useEffect(() => {
    if (configData && Object.keys(configData).length > 0) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);

  return (
    <>
      <CssBaseline />
      <SEO
        title={metaTitle}
        image={metaImage}
        businessName={configData?.business_name}
        description={storeDetails?.meta_description}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <StoreDetails storeDetails={storeDetails} configData={configData} />
      </MainLayout>
    </>
  );
};

export default StorePage;

export const getServerSideProps = async (context) => {
  const {
    id: storeId,
    module,
    module_id: legacyModuleId,
    lat,
    lng,
    distance,
  } = context.query;
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

  const moduleId = module || legacyModuleId;

  console.time("Fetch Config + Store Details");
  const [configSettled, storeDetailsSettled] = await Promise.allSettled([
    fetchWithTimeoutRetry(`${baseUrl}${config_api}`, {
      method: "GET",
      headers: { ...headersCommon, lat, lng },
    }),
    fetchWithTimeoutRetry(`${baseUrl}${store_details_api}/${storeId}`, {
      method: "GET",
      headers: { ...headersCommon, moduleId },
    }),
  ]);
  console.timeEnd("Fetch Config + Store Details");

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

  // storeDetails can gracefully degrade to null on a pure network/timeout failure.
  let storeDetails = null;
  if (storeDetailsSettled.status === "rejected") {
    console.error(
      "store_details network error:",
      storeDetailsSettled.reason?.message,
    );
  } else {
    const storeDetailsRes = storeDetailsSettled.value;
    if (!storeDetailsRes.ok) {
      return { notFound: true };
    }
    try {
      storeDetails = await storeDetailsRes.json();
    } catch (error) {
      console.error("store_details parse error:", error.message);
      return { notFound: true };
    }
    if (!storeDetails?.id) {
      console.error("store_details failed:", { storeDetails });
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
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  return {
    props: {
      configData,
      storeDetails,
      distance: distance || null,
    },
  };
};
