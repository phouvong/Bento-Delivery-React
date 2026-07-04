import React, { useEffect, useState } from "react";
import useGetCoupons from "../../api-manage/hooks/react-query/useGetCoupons";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import CustomEmptyResult from "../custom-empty-result";
import nodataimage from "../../../public/static/nodata.png";
import Coupon from "./Coupon";
import CustomShimmerCard from "./Shimmer";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useGetCouponLists } from "api-manage/hooks/react-query/useCouponsLists";
import NewCouponCard from "./NewCouponCard";

const Coupons = ({ moduleId, moduleType }) => {
  const [copy, setCopy] = useState(null);

  const {
    data: rentalCouponData,
    refetch: rentalCouponRefetch,
    isLoading: isRentalCouponLoading,
    isFetching: isRentalCouponFetching,
  } = useGetCouponLists(moduleId);
  const { data, refetch, isLoading, isFetching } = useGetCoupons(moduleId);

  // When a module is explicitly selected (Coupons tab), trust its type;
  // otherwise fall back to the globally selected module in localStorage.
  const isRentalModule = moduleType
    ? moduleType === "rental"
    : getCurrentModuleType() === "rental";

  useEffect(() => {
    if (isRentalModule) {
      rentalCouponRefetch();
    } else {
      refetch();
    }
  }, [moduleId, isRentalModule]);

  const couponData = isRentalModule ? rentalCouponData ?? [] : data ?? [];
  const isCouponLoading = isRentalModule ? isRentalCouponLoading : isLoading;
  const isCouponFetching = isRentalModule ? isRentalCouponFetching : isFetching;

  return (
    <Box
      mt={{ xs: "12px", md: "2rem" }}
      minHeight="60vh"
      paddingLeft={{ xs: "10px", sm: "20px", md: "25px" }}
      paddingRight={{ xs: "10px", sm: "20px", md: "40px" }}
      paddingBottom={{ xs: "24px", md: "32px" }}
    >
      <Grid container spacing={2}>
        {couponData &&
          couponData?.length > 0 &&
          couponData?.map((coupon, index) => {
            return (
              <Grid item sm={6} xs={12} md={4} key={index}>
                <NewCouponCard coupon={coupon} setCopy={setCopy} copy={copy} />
              </Grid>
            );
          })}
        {/* {couponData &&
          couponData?.length > 0 &&
          couponData?.map((coupon, index) => {
            return (
              <Grid item sm={6} xs={12} md={4} key={index}>
                <Coupon
                  coupon={coupon}
                  isLoading={isLoading}
                  setCopy={setCopy}
                  copy={copy}
                />
              </Grid>
            );
          })} */}
        {couponData && !isCouponFetching && couponData.length === 0 && (
          <CustomEmptyResult label="No Coupon Found" image={nodataimage} />
        )}
        {(isCouponLoading || isCouponFetching) && <CustomShimmerCard />}
      </Grid>
    </Box>
  );
};

Coupons.propTypes = {};

export default Coupons;
