import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import TypeWiseStore from "../../../src/components/Store/TypeWiseStore";
import MainLayout from "../../../src/components/layout/MainLayout";
import { getServerSideProps } from "../../index";
import SEO from "../../../src/components/seo";
import { PageDetailsWrapper } from "../../../src/styled-components/CustomStyles.style";
import CustomContainer from "../../../src/components/container";
import { top_offer_near_me } from "../../../src/api-manage/ApiRoutes";
import { NoSsr } from "@mui/material";

const Index = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `${t("Top offers near me")}` : "Loading..."}
        image={`${configData?.base_urls?.business_logo_url}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <PageDetailsWrapper>
          <CustomContainer>
            <NoSsr>
              <TypeWiseStore
                configData={configData}
                t={t}
                storeType="top_offer_near_me"
                title="Top offers near me"
              />
            </NoSsr>
          </CustomContainer>
        </PageDetailsWrapper>
      </MainLayout>
    </>
  );
};

export default Index;
export { getServerSideProps };
