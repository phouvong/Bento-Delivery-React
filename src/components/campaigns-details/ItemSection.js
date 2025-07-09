import React, { useState } from "react";
import {Grid, Typography, useMediaQuery} from "@mui/material";
import { useSelector } from "react-redux";
import CustomEmptyResult from "../custom-empty-result";
import noData from "../../../public/static/newnoitem.png";
import StoreShimmer from "../Shimmer/StoreShimmer";
import StoreCard from "../cards/StoreCard";

const ItemSection = ({ campaignsDetails, isLoading, isRefetching }) => {
  const [page_limit, setPageLimit] = useState(10);
  const [offset, setOffset] = useState(1);
  const { configData } = useSelector((state) => state.configData);
  const matches = useMediaQuery("(max-width:1475px)");
  const matchesXs = useMediaQuery("(max-width:480px)");
  return (
    <>
      <Grid container spacing={{ xs: 0.5, md: 1 }}>
        <Grid item xs={12}>
          <Typography paddingLeft="20px" fontSize="20px" fontWeight="700">{("Store list")}</Typography>

        </Grid>
        {campaignsDetails?.stores?.length > 0 &&
          campaignsDetails?.stores?.map((store) => {
            return (
              <Grid
                key={store?.id}
                item
                md={matches ? 3 : 3}
                sm={4}
                xs={matchesXs ? 12 : 3}
              >
                <StoreCard
                  item={store}
                  imageUrl={store?.cover_photo_full_url}
                />
              </Grid>
            );
          })}
        {isLoading && <StoreShimmer />}
      </Grid>
      {campaignsDetails?.stores?.length === 0 && (
        <CustomEmptyResult
          label="No store found"
          image={noData}
          height="200px"
          width="200px"
        />
      )}
    </>
  );
};

export default ItemSection;
