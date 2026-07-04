import { Box, NoSsr } from "@mui/material";
import MainLayout from "src/components/layout/MainLayout";
import ModuleHomeSidebarLayout from "src/components/home/sidebar-layout/ModuleHomeSidebarLayout";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { getFoodSections } from "src/components/home/module-wise-components/food/foodSectionsConfig";
import { getGrocerySections } from "src/components/home/module-wise-components/grocery/grocerySectionsConfig";
import { getPharmacySections } from "src/components/home/module-wise-components/pharmacy/pharmacySectionsConfig";
import { getEcommerceSections } from "src/components/home/module-wise-components/ecommerce/ecommerceSectionsConfig";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setConfigData } from "redux/slices/configData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import SEO from "src/components/seo";
import AuthGuard from "src/components/route-guard/AuthGuard";
import { useRouter } from "next/router";
import { processMetadata } from "utils/fetchPageMetaData";
import WishListLayout from "components/wishlist/WishListLayout";
import RentalWishListLayout from "components/home/module-wise-components/rental/components/home/RentalWishListLayout";

const WishlistPage = ({ configData, metaData }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const metadata = processMetadata(metaData, {
    title: `Favourite - ${configData?.business_name}`,
    description: metaData?.description || "",
    image: metaData?.image || configData?.logo_full_url,
    robotsMeta: metaData?.robotsMeta || "",
  });

  useEffect(() => {
    if (configData && Object.keys(configData).length > 0) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);

  const moduleType = getCurrentModuleType();
  const isModuleWithSidebar =
    moduleType === ModuleTypes.FOOD ||
    moduleType === ModuleTypes.GROCERY ||
    moduleType === ModuleTypes.PHARMACY ||
    moduleType === ModuleTypes.ECOMMERCE;

  const sections =
    moduleType === ModuleTypes.FOOD
      ? getFoodSections()
      : moduleType === ModuleTypes.GROCERY
      ? getGrocerySections()
      : moduleType === ModuleTypes.PHARMACY
      ? getPharmacySections()
      : moduleType === ModuleTypes.ECOMMERCE
      ? getEcommerceSections()
      : [];

  return (
    <>
      <SEO
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        robotsMeta={metadata.robotsMeta}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <NoSsr>
          <AuthGuard from={router.pathname.replace("/", "")}>
            <Box sx={{ mt: { xs: 0, md: "34px" } }}>
              {moduleType === ModuleTypes.RENTAL ? (
                <RentalWishListLayout configData={configData} />
              ) : isModuleWithSidebar ? (
                <ModuleHomeSidebarLayout
                  overviewContent={<WishListLayout configData={configData} />}
                  sections={sections}
                />
              ) : (
                <WishListLayout configData={configData} />
              )}
            </Box>
          </AuthGuard>
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default WishlistPage;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "home_page");
};
