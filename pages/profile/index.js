import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import { useTranslation } from "react-i18next";
import { NoSsr } from "@mui/material";
import AuthGuard from "../../src/components/route-guard/AuthGuard";
import { useRouter } from "next/router";
import SEO from "../../src/components/seo";
import UserInformation from "../../src/components/user-information/UserInformation";
import jwt from "base-64";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../src/redux/slices/configData";

const Index = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { page, orderId, token } = router.query;
  const [attributeId, setAttributeId] = useState("");
  const { landingPageData, configData } = useSelector(
    (state) => state.configData
  );
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
  useEffect(() => {
    if (!token) return;

    // Only the order-attribute flow encodes a base64 payload here. Other
    // gateway callbacks (e.g. Pro plan subscription) drop arbitrary opaque
    // tokens into the URL, so guard the decode to avoid InvalidCharacterError
    // from base-64 — the dev overlay surfaces it even when try/catch handles it.
    const candidate = String(token).trim();
    const looksLikeBase64 =
      candidate.length > 0 &&
      candidate.length % 4 === 0 &&
      /^[A-Za-z0-9+/]+={0,2}$/.test(candidate);
    if (!looksLikeBase64) return;

    try {
      const decodedToken = jwt.decode(candidate);
      if (typeof decodedToken !== "string") return;
      // Payload format: "key1=value1&&key2=value2&&..."
      const keyValuePairs = decodedToken.split("&&");
      for (const pair of keyValuePairs) {
        const [key, value] = pair.split("=");
        if (key === "attribute_id") {
          if (
            page === "my-orders?flag=success" ||
            page === "my-orders" ||
            page === "my-orders?flag=cancel" ||
            page === "my-orders?flag=fail"
          ) {
            setAttributeId(value);
          }
          return;
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [token]);
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
        <NoSsr>
          <AuthGuard from={router.pathname.replace("/", "")} requireToken>
            <UserInformation
              page={page}
              configData={configData}
              orderId={orderId ?? attributeId}
            />
          </AuthGuard>
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;
