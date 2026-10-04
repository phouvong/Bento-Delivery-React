import React from "react";
import TrackOrderInput from "../../src/components/track-order/TrackOrderInput";
import CssBaseline from "@mui/material/CssBaseline";
import SEO from "../../src/components/seo";
import MainLayout from "../../src/components/layout/MainLayout";
import { getServerSideProps } from "../index";
import CustomContainer from "../../src/components/container";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";

const TrackOrder = ({ configData }) => {
  return (
    <div>
      <CssBaseline />
      <SEO
        image={`${configData?.base_urls?.logo_full_url}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <SimpleMobileHeader title="Track Order" />
        <CustomContainer>
          <TrackOrderInput configData={configData} />
        </CustomContainer>
      </MainLayout>
    </div>
  );
};

export default TrackOrder;
export { getServerSideProps };
