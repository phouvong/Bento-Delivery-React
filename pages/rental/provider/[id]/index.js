import CssBaseline from "@mui/material/CssBaseline";

import SEO from "../../../../src/components/seo";
import MainLayout from "../../../../src/components/layout/MainLayout";

import { useDispatch } from "react-redux";

import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";
import { useEffect } from "react";
import RentalProviderDetailsPage from "../../../../src/components/home/module-wise-components/rental/components/rental-provider-details/RentalProviderDetailsPage";
import { NoSsr } from "@mui/material";

const Index = ({ providerMetaData,configData }) => {
  const dispatch = useDispatch();

  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

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
  console.log({ providerMetaData});
  return (
    <>
      <CssBaseline />
      <SEO
        title={providerMetaData?.meta_title || (configData ? `Provider` : "")}
        image={providerMetaData?.meta_image || configData?.logo_full_url}
        businessName={configData?.business_name}
        configData={configData}
        description={providerMetaData?.meta_description}
        robotsMeta={providerMetaData?.meta_data}
      />
      <MainLayout configData={configData}>
        <NoSsr>
          <RentalProviderDetailsPage configData={configData} />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  const { id, module, module_id: legacyModuleId } = context.query;
  const { req } = context;
  const language = req.cookies.languageSetting || "en";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const origin = process.env.NEXT_CLIENT_HOST_URL;
  const moduleId = module || legacyModuleId;

  let providerMetaData = null;
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
      const providerDetailsRes = await fetch(
        `${baseUrl}/api/v1/rental/provider/get-provider-details/${id}`,
        {
          method: "GET",
          headers,
        }
      );

      if (providerDetailsRes.ok) {
        const providerDetailsData = await providerDetailsRes.json();

        providerMetaData = {
          meta_title: providerDetailsData?.meta_title || null,
          meta_image: providerDetailsData?.meta_image_full_url || null,
          meta_description: providerDetailsData?.meta_description || null,
          meta_data: providerDetailsData?.meta_data || null,
        };
      }
    }
  } catch (error) {
    console.error("SSR vehicle details fetch failed:", error?.message || error);
  }

  return {
    props: {
      providerMetaData,
      configData: config || null,
    },
  };
};
