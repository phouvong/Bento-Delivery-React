import CssBaseline from "@mui/material/CssBaseline";
import SEO from "../../../src/components/seo";
import MainLayout from "../../../src/components/layout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigData } from "../../../src/api-manage/hooks/useGetConfigData";
import { setConfigData } from "../../../src/redux/slices/configData";
import { useEffect } from "react";
import VehicleSearchPage from "../../../src/components/home/module-wise-components/rental/components/vehicle-search/VehicleSearchPage";
import { NoSsr } from "@mui/material";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { processMetadata } from "utils/fetchPageMetaData";

const index = ({ configData ,metaData}) => {
    const metadata=processMetadata(metaData, {
        title: `Vehicle Search - ${configData?.business_name}`,
        description: metaData?.description || '',
        image: `${metaData?.image || configData?.logo_full_url}`,
        robotsMeta: metaData?.robotsMeta || ''
      })
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    }
  }, [configData]);
  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata?.title}
        image={metadata?.image}
        description={metadata?.description}
        robotsMeta={metadata?.robotsMeta}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} >
        <NoSsr>
          <VehicleSearchPage />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default index;
export const getServerSideProps = async (context) => {
    return await getCommonServerSideProps(context, 'vehicle_search_page')
}
