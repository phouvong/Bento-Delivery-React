import CssBaseline from "@mui/material/CssBaseline";
import { Box, NoSsr } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConfigData } from "redux/slices/configData";
import { processMetadata } from "utils/fetchPageMetaData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import MainLayout from "components/layout/MainLayout";
import SEO from "components/seo";
import { getFoodSections } from "components/home/module-wise-components/food/foodSectionsConfig";
import { getGrocerySections } from "components/home/module-wise-components/grocery/grocerySectionsConfig";
import { getPharmacySections } from "components/home/module-wise-components/pharmacy/pharmacySectionsConfig";
import { getEcommerceSections } from "components/home/module-wise-components/ecommerce/ecommerceSectionsConfig";
import ModuleHomeSidebarLayout from "components/home/sidebar-layout/ModuleHomeSidebarLayout";
import CategoryPageContent from "components/home/category-page/CategoryPageContent";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

const CategoryPage = ({ configData, metaData }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const metadata = processMetadata(metaData, {
    title: `${router.query.name ?? "Category"} - ${configData?.business_name ?? ""}`,
    description: metaData?.description || "",
    image: `${metaData?.image || configData?.logo_full_url || ""}`,
    robotsMeta: metaData?.robotsMeta || "",
  });

  useEffect(() => {
    if (configData && Object.keys(configData).length > 0) {
      dispatch(setConfigData(configData));
    }
  }, [configData]); // eslint-disable-line react-hooks/exhaustive-deps

  const moduleType = getCurrentModuleType();

  const sections =
    moduleType === ModuleTypes.FOOD ? getFoodSections() :
    moduleType === ModuleTypes.GROCERY ? getGrocerySections() :
    moduleType === ModuleTypes.PHARMACY ? getPharmacySections() :
    moduleType === ModuleTypes.ECOMMERCE ? getEcommerceSections() :
    [];

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
        <NoSsr>
          <Box sx={{ mt: { xs: "16px", md: "34px" } }}>
            <ModuleHomeSidebarLayout
              overviewContent={<CategoryPageContent configData={configData} />}
              sections={sections}
            />
          </Box>
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default CategoryPage;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "search_page");
};
