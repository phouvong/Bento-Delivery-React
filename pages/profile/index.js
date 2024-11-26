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
    if (token) {
      try {
        // Attempt to decode the Base64 token
        const decodedToken = jwt.decode(token);

        // Check if decodedToken is a valid string
        if (typeof decodedToken === "string") {
          // Assuming decodedToken is in the format: "key1=value1&&key2=value2&&..."
          const keyValuePairs = decodedToken.split("&&");

          // Loop through the key-value pairs to find the one with attribute_id
          for (const pair of keyValuePairs) {
            const [key, value] = pair.split("=");
            if (key === "attribute_id") {
              setAttributeId(value);
              return; // Exit the loop when attribute_id is found
            }
          }
        } else {
          console.error("Decoded token is not a string:", decodedToken);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("Token is missing.");
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
          <AuthGuard from={router.pathname.replace("/", "")}>
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
