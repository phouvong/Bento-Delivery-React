import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "../../src/components/layout/MainLayout";
import SearchResult from "../../src/components/home/search";
import SEO from "../../src/components/seo";
import { fetchPageMetadata, processMetadata } from "utils/fetchPageMetaData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { getToken } from "helper-functions/getToken";
import SearchWithTitle from "components/home/SearchWithTitle";
import { NoSsr } from "@mui/material";
import { setConfigData } from "redux/slices/configData";
import { useDispatch } from "react-redux";

const SearchPage = ({ configData, metaData }) => {
    const metadata = processMetadata(metaData, {
        title: `Search - ${configData?.business_name}`,
        description: metaData?.description || '',
        image: `${metaData?.image || configData?.logo_full_url}`,
        robotsMeta: metaData?.robotsMeta || ''
    })
    const router = useRouter();
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState(0);
    const token = getToken();
    const zoneid =
        typeof window !== "undefined" ? localStorage.getItem("zoneid") : undefined;

    console.log({configData,metaData});
     useEffect(() => {
       if (configData && Object.keys(configData).length > 0) {
          dispatch(setConfigData(configData));
        }
      }, [configData ]);
    
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
                <SearchWithTitle
                    currentTab={0}
                    zoneid={zoneid}
                    token={token}
                    searchQuery={
                        router.query?.data_type === "searched"
                            ? router.query.search
                            : ""
                    }
                    name={router.query.name}
                    query={router.query}
                />
               
                <SearchResult
                    searchValue={router.query.search}
                    name={router.query.name}
                    isSearch={router.query.fromSearch}
                    routeTo={router.query.from}
                    configData={configData}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                />
                 </NoSsr>
            </MainLayout>
        </>
    );
};

export default SearchPage;

export const getServerSideProps = async (context) => {
    return await getCommonServerSideProps(context, 'search_page')
}
