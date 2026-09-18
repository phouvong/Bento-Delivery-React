import { Box, Grid, useTheme } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { CustomBoxFullWidth, CustomStackFullWidth } from "styled-components/CustomStyles.style";
import EmptySearchResults from "components/EmptySearchResults";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import DotSpin from "components/DotSpin";
import useGetExploreServices from "../../../service-api-manage/hooks/react-query/explore-services/useGetExploreServices";

const AllServices = ({ filteredData, setTotalDataCount }) => {
  const theme = useTheme();
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetExploreServices({ categoryId: filteredData });

  const services = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page?.services ?? []),
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
        {!isLoading && services.length === 0 && (
          <EmptySearchResults text="Services not found!" />
        )}

        {isLoading
          ? [...Array(10)].map((_, i) => (
              <Grid
                key={i}
                item
                xs={6}
                sm={4}
                md={3}
                sx={{ [theme.breakpoints.up("lg")]: { flexBasis: "20%", maxWidth: "20%" } }}
              >
                <ProductCardSimmer cardWidth="100%" />
              </Grid>
            ))
          : services.map((item, index) => (
              <Grid
                key={item.id || index}
                item
                xs={6}
                sm={4}
                md={3}
                sx={{ [theme.breakpoints.up("lg")]: { flexBasis: "20%", maxWidth: "20%" } }}
              >
                <Box sx={{ "& > *": { width: "100% !important" } }}>
                  <NewProductCard variant="vertical" item={item} />
                </Box>
              </Grid>
            ))}
      </Grid>

      {!isLoading && isFetchingNextPage && (
        <CustomStackFullWidth alignItems="center" justifyContent="center" mt="3rem">
          <DotSpin />
        </CustomStackFullWidth>
      )}

      {hasNextPage && <CustomBoxFullWidth ref={ref} />}
    </CustomBoxFullWidth>
  );
};

AllServices.propTypes = {};

export default React.memo(AllServices);
