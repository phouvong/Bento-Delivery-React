import { Box, Grid } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import useGetStoresByFiltering from "../../../api-manage/hooks/react-query/store/useGetStoresByFiltering";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import DotSpin from "../../DotSpin";
import EmptySearchResults from "components/EmptySearchResults";

const AllStores = (props) => {
  const {
    selectedFilterValue,
    configData,
    setTotalDataCount,
    filteredData,
  } = props;

  const { ref, inView } = useInView();

  const pageParams = {
    type: selectedFilterValue,
    limit: 12,
    filteredData,
    enabled: true,
  };

  const {
    data,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useGetStoresByFiltering(pageParams);

  const storeData = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page?.stores ?? []),
    [data]
  );

  useEffect(() => {
    const lastPage = data?.pages?.[data.pages.length - 1];
    if (lastPage?.total_size !== undefined) {
      setTotalDataCount(lastPage.total_size);
    }
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <CustomBoxFullWidth>
      <Grid container spacing={3}>
        {storeData.length === 0 && !isLoading && (
          <EmptySearchResults text="Stores not found!" />
        )}
        {storeData.length > 0 &&
          !isLoading &&
          storeData.map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Box sx={{ "& > *": { width: "100% !important" } }}>
                <NewStoreCard
                  variant="normal"
                  item={item}
                  imageUrl={item?.cover_photo_full_url}
                />
              </Box>
            </Grid>
          ))}
        {isLoading &&
          [...Array(6)].map((_, i) => (
            <Grid key={i} item xs={12} sm={6} md={4}>
              <NewStoreCardSkeleton />
            </Grid>
          ))}
        {!isLoading && isFetchingNextPage && (
          <CustomStackFullWidth alignItems="center" justifyContent="center" mt="3rem">
            <DotSpin />
          </CustomStackFullWidth>
        )}
      </Grid>
      {hasNextPage && <CustomBoxFullWidth ref={ref} />}
    </CustomBoxFullWidth>
  );
};

AllStores.propTypes = {};

export default React.memo(AllStores);
