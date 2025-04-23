import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import SEO from "../../../../src/components/seo";
import {useTranslation} from "react-i18next";
import MainLayout from "../../../../src/components/layout/MainLayout";
import {PageDetailsWrapper} from "../../../../src/styled-components/CustomStyles.style";
import CustomContainer from "../../../../src/components/container";
import TypeWiseStore from "../../../../src/components/Store/TypeWiseStore";
import { getServerSideProps } from "../../../index";
import {getCurrentModuleType} from "../../../../src/helper-functions/getCurrentModuleType";


const Index = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `${t("Popular store")}` : "Loading..."}
        image={configData?.fav_icon_full_url}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <PageDetailsWrapper>
          <CustomContainer>
            <TypeWiseStore
              configData={configData}
              t={t}
              storeType="popular"
              title={getCurrentModuleType() === "rental"?"Popular Providers":"Popular Stores"}
            />
          </CustomContainer>
        </PageDetailsWrapper>
      </MainLayout>
    </>
  );
};

export default Index;
export { getServerSideProps };
