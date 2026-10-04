import CssBaseline from "@mui/material/CssBaseline";
import dynamic from "next/dynamic";
import { processMetadata } from "utils/fetchPageMetaData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import CustomContainer from "components/container";
import MainLayout from "components/layout/MainLayout";
import SEO from "components/seo";

const AllProviders = dynamic(() => import("../../../src/components/all-stores"), {
  ssr: false,
});

const Index = ({ configData, metaData }) => {
  const metadata = processMetadata(metaData, {
    title: `All Providers - ${configData?.business_name ?? ""}`,
    description: metaData?.description || "",
    image: `${metaData?.image || configData?.logo_full_url}`,
    robotsMeta: metaData?.robotsMeta || "",
  });
  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        robotsMeta={metadata.robotsMeta}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <CustomContainer sx={{ mt: { xs: "0", md: "34px" } }}>
          <AllProviders />
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "providers_page");
};
