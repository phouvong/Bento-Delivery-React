import { LandingLayout } from "components/layout/LandingLayout";
import LandingPage from "../src/components/landing-page";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConfigData, setLandingPageData } from "redux/slices/configData";
import Router from "next/router";
import SEO from "../src/components/seo";
import useGetLandingPage from "../src/api-manage/hooks/react-query/useGetLandingPage";
import { getImageUrl } from "utils/CustomFunctions";
import { useGetConfigData } from "../src/api-manage/hooks/useGetConfigData";

const Root = (props) => {
  const { configData } = props;
  const { data, refetch } = useGetLandingPage();
  const dispatch = useDispatch();
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();
  useEffect(() => {
    configRefetch();
    refetch();
  }, []);
  useEffect(() => {
    dispatch(setLandingPageData(data));
    if (dataConfig) {
      if (dataConfig.length === 0) {
        Router.push("/404");
      } else if (dataConfig?.maintenance_mode) {
        Router.push("/maintainance");
      } else {
        dispatch(setConfigData(dataConfig));
      }
    } else {
    }
  }, [dataConfig, data]);

  return (
    <>
      <CssBaseline />
      {/* <DynamicFavicon configData={configData} /> */}
      <SEO
        image={configData?.fav_icon_full_url}
        businessName={configData?.business_name}
        configData={configData}
      />
      {data && (
        <LandingLayout configData={dataConfig} landingPageData={data}>
          <LandingPage configData={dataConfig} landingPageData={data} />
        </LandingLayout>
      )}
    </>
  );
};
export default Root;
export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const language = req.cookies.languageSetting;

  const configRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        "X-localization": language,
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const config = await configRes.json();
  // Set cache control headers for 1 hour (3600 seconds)
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate"
  );

  return {
    props: {
      configData: config,
    },
  };
};
