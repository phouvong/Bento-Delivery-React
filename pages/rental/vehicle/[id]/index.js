import CssBaseline from "@mui/material/CssBaseline";

import SEO from "../../../../src/components/seo";
import MainLayout from "../../../../src/components/layout/MainLayout";

import { useDispatch, useSelector } from "react-redux";

import { useGetConfigData } from "../../../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../../../src/redux/slices/configData";
import { useEffect } from "react";
import VehicleDetailsPage from "../../../../src/components/home/module-wise-components/rental/components/vehicle-details/VehicleDetailsPage";
import { NoSsr } from "@mui/material";

const index = ({ vehicleDetailsData, configData }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { landingPageData, configData: storeConfigData } = useSelector(
    (state) => state.configData
  );
  const effectiveConfigData = configData || storeConfigData;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);
  return (
    <>
      <CssBaseline />
      <SEO
        title={vehicleDetailsData?.meta_title || effectiveConfigData?.business_name}
        image={vehicleDetailsData?.meta_image || effectiveConfigData?.fav_icon_full_url}
        businessName={effectiveConfigData?.business_name}
        configData={effectiveConfigData}
        description={vehicleDetailsData?.meta_description || ''}
        robotsMeta={vehicleDetailsData?.meta_data}
      />
      <MainLayout configData={effectiveConfigData} landingPageData={landingPageData}>
       <NoSsr>
        <VehicleDetailsPage vehicleDetailsData={vehicleDetailsData} />
       </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;

export const getServerSideProps = async (context) => {
  const { id, module, module_id: legacyModuleId } = context.query;
  const { req } = context;
  const language = req.cookies.languageSetting || "en";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const origin = process.env.NEXT_CLIENT_HOST_URL;
  const moduleId = module || legacyModuleId;

  let vehicleDetailsData = null;
  let config = null;

  try {
    const headers = {
      "X-software-id": 33571750,
      "X-server": "server",
      origin,
      "X-localization": language,
    };

    if (moduleId) {
      const moduleIdValue = String(moduleId);
      headers.moduleId = moduleIdValue;
      headers["module_id"] = moduleIdValue;
    }

    const configRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
      {
        method: "GET",
        headers: {
          "X-software-id": 33571750,
          "X-server": "server",
          origin: process.env.NEXT_CLIENT_HOST_URL,
        },
      }
    );

    if (!configRes.ok) {
      throw new Error(`Failed to fetch config: ${configRes.statusText}`);
    }

    config = await configRes.json();

    if (id) {
      const vehicleDetailsRes = await fetch(
        `${baseUrl}/api/v1/rental/vehicle/get-vehicle-details/${id}`,
        {
          method: "GET",
          headers,
        }
      );

      if (vehicleDetailsRes.ok) {
        vehicleDetailsData = await vehicleDetailsRes.json();
      }
    }
  } catch (error) {
    console.error("SSR vehicle details fetch failed:", error?.message || error);
  }

  return {
    props: {
      vehicleDetailsData,
      configData: config || null,
    },
  };
};
