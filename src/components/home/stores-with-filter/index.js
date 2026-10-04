import React, {useEffect, useState} from "react";
import StoresFilteringNav from "./StoresFilteringNav";
import useGetStoresByFiltering from "../../../api-manage/hooks/react-query/store/useGetStoresByFiltering";
import CardsGrid from "./cards-grid";
import Shimmer from "./Shimmer";
import useGetPopularStore from "../../../api-manage/hooks/react-query/store/useGetPopularStore";
import {HomeComponentsWrapper} from "../HomePageComponents";

const StoresWithFilter = () => {
    const [storesType, setStoresType] = useState("all");
    const [type, setType] = useState("all");
    const [limit, setLimit] = useState(10);

    const {data, refetch, isFetching, isSuccess, isRefetching} = useGetStoresByFiltering({
        type: type,
        limit: limit,
        enabled: true,
    });
    let queryKey = "homepage-popular-stores";
    const {
        data: popularStore,
        refetch: refetchPopularStore,
        isFetching: isFetchingPopular,
        isSuccess: isSuccessPopular
    } = useGetPopularStore(queryKey, type);
    const handleRefetch = () => {
        if (storesType === "all") {
            refetch();
        } else {
            refetchPopularStore();
        }
    };
    useEffect(() => {
        handleRefetch();
        setType("all");
    }, [storesType]);
    useEffect(() => {
        handleRefetch();
    }, [type, limit]);
    const handleMore = () => {
        setLimit((prevState) => prevState + 5);
    };


    const allStores = (data?.pages ?? []).flatMap((p) => p?.stores ?? []);
    const totalSize = data?.pages?.[0]?.total_size;

    const handleDataVisibility = () => {
        if (storesType === "all") {
            if (allStores.length > 0) {
                return <CardsGrid
                    data={allStores}
                    totalSize={totalSize}
                    handleMore={handleMore}
                    isFetching={!isSuccess ? false : isRefetching}
                />
            }
        } else {
            if (popularStore && popularStore.length > 0) {
                return <CardsGrid
                    data={popularStore}
                    totalSize={popularStore?.length}
                    handleMore={handleMore}
                />
            }
        }
    }
    return (
        <>
            {
                allStores.length > 0 && <HomeComponentsWrapper sx={{paddingTop: ".5rem"}} spacing={2}>
                    <StoresFilteringNav
                        storesType={storesType}
                        setStoresType={setStoresType}
                        setType={setType}
                    />
                    {handleDataVisibility()}
                    {storesType === 'all' && !isSuccess && <Shimmer count={10}/>}
                    {storesType === 'popular' && !isSuccessPopular && <Shimmer count={10}/>}

                </HomeComponentsWrapper>
            }</>

    );
};

export default StoresWithFilter;
