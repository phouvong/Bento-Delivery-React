import { Grid, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { removeDuplicates } from "utils/CustomFunctions";
import useGetStoresByFiltering from "../../../api-manage/hooks/react-query/store/useGetStoresByFiltering";
import StoreCard from "../../cards/StoreCard";
import DotSpin from "../../DotSpin";
import CustomEmptyResult from "components/custom-empty-result";
import noData from "../../../../public/static/newnoitem.png";
import EmptySearchResults from "components/EmptySearchResults";

const AllStores = (props) => {
  const theme = useTheme();
  const {
    selectedFilterValue,
    configData,
    totalDataCount,
    setTotalDataCount,
    filteredData,
  } = props;
  const [offset, setOffSet] = useState(1);
  const [page_limit, setPage_Limit] = useState(12);
  const [storeData, setStoreData] = useState([]);
  const { ref, inView } = useInView();
  const prevSelectedFilter = useRef();
  const preFilterData = useRef();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const pageParams = {
    type: selectedFilterValue,
    offset,
    limit: page_limit,
    filteredData,
  };
  const {
    data,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = useGetStoresByFiltering(pageParams);
  // useEffect(() => {
  //   refetch();
  // }, [convertFilterText]);

  useEffect(() => {
    setOffSet(1);
  }, [selectedFilterValue, filteredData]);
  const handleAPiCallOnSuccess = (item) => {
    setTotalDataCount(item.total_size);
    if (
      filteredData === preFilterData.current ||
      selectedFilterValue === prevSelectedFilter?.current
    ) {
      setStoreData((prev) =>
        removeDuplicates([...new Set([...prev, ...item?.stores])], "id")
      );
    } else {
      setStoreData(item?.stores);
    }
    preFilterData.current = filteredData;
    prevSelectedFilter.current = selectedFilterValue;
  };

  const handleStoreData = () => {
    if (data && data?.pages?.length > 0) {
      data?.pages?.forEach((item) => {
        handleAPiCallOnSuccess(item);
      });
    }
  };
  useEffect(() => {
    handleStoreData();
  }, [data]);
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, selectedFilterValue, filteredData]);

  useEffect(() => {
    refetch();
  }, [filteredData]);
  return (
    <CustomBoxFullWidth>
      <Grid container spacing={2}>
        {storeData?.length === 0 && !isLoading && (
          <EmptySearchResults text="Stores not found!" />
        )}
        {storeData?.length > 0 &&
          !isLoading &&
          storeData?.map((item, index) => {
            return (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <StoreCard item={item} imageUrl={item?.cover_photo_full_url} />
              </Grid>
            );
          })}
        {(isLoading || isFetchingNextPage) && (
          <CustomStackFullWidth
            alignItems="center"
            justifyContent="center"
            mt={storeData?.length === 0 ? (isSmall ? "7rem" : "10rem") : "3rem"}
          >
            <DotSpin />
          </CustomStackFullWidth>
        )}
      </Grid>
      {totalDataCount !== storeData.length && (
        <CustomBoxFullWidth ref={ref}></CustomBoxFullWidth>
      )}
    </CustomBoxFullWidth>
  );
};

AllStores.propTypes = {};

export default React.memo(AllStores);
