import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "./EmptyCart";
import CartActions from "./CartActions";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CartContents from "./CartContents";
import { getCartListModuleWise } from "../../helper-functions/getCartListModuleWise";
import { useRouter } from "next/router";
import CustomSideDrawer from "../side-drawer/CustomSideDrawer";
import DrawerHeader from "./DrawerHeader";
import CartIcon from "./assets/CartIcon";
import FreeDeliveryProgressBar from "./FreeDeliveryProgressBar";
import CartTotalPrice from "./CartTotalPrice";
import { useTheme } from "@emotion/react";
import DotSpin from "../DotSpin";
import { Stack } from "@mui/system";
import { Typography } from "@mui/material";
import { t } from "i18next";
import useClearCart from "../../api-manage/hooks/react-query/add-cart/useClearCart";
import { toast } from "react-hot-toast";
import { onErrorResponse } from "../../api-manage/api-error-response/ErrorResponses";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import CustomDialogConfirm from "../custom-dialog/confirm/CustomDialogConfirm";
import { setClearCart } from "redux/slices/cart";

const SavedAmountIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_20439_61130)">
      <path d="M6.95967 11.0401L5.71268 9.26271L3.82782 7.9082C3.68258 8.29108 3.5578 8.62003 3.4126 9.0029L4.59673 10.6626L6.20471 11.795L6.95963 11.7124L6.95967 11.0401Z" fill="#FC6DAE" />
      <path d="M4.69473 13.305L3.93977 12.1099L2.58209 11.1924C2.43689 11.5753 2.31211 11.9042 2.16687 12.2871L2.85635 13.4505L3.93977 14.06H4.53739L4.69473 13.305Z" fill="#FC6DAE" />
      <path d="M6.20471 11.795L7.36088 13.3911L8.99682 14.5871C9.37969 14.4419 9.70865 14.3171 10.0915 14.1719L8.71328 12.442L6.95967 11.04C6.6956 11.3041 6.46875 11.531 6.20471 11.795Z" fill="#F73D7F" />
      <path d="M3.93982 14.0606L4.58492 15.0882L5.71271 15.8335C6.09559 15.6883 6.42454 15.5635 6.80741 15.4183L5.90173 14.1726L4.69478 13.3057C4.43074 13.5697 4.20386 13.7966 3.93982 14.0606Z" fill="#F73D7F" />
      <path d="M8.09203 9.90809L6.58211 7.9087L4.45061 6.2666C4.2527 6.78834 4.02567 7.38693 3.82776 7.9087C4.20665 8.28756 6.57823 10.6592 6.95961 11.0406L7.75229 10.7461L8.09203 9.90809Z" fill="#FFD92E" />
      <path d="M6.95959 11.0406C7.33845 11.4195 9.71006 13.7911 10.0914 14.1725C10.6132 13.9746 11.2117 13.7475 11.7335 13.5496L10.0914 11.4817L8.09206 9.9082C7.73203 10.2682 7.31955 10.6806 6.95959 11.0406Z" fill="#FCBE00" />
      <path d="M7.71452 8.02039H6.95959V7.26543C7.50041 6.72465 8.16441 6.06065 8.46952 5.75547C9.07447 5.15052 9.4077 4.34616 9.4077 3.49055C9.4077 2.63501 9.07451 1.83065 8.46952 1.22566C8.73356 0.961626 8.96044 0.734742 9.22448 0.470703C10.8869 2.13306 10.9003 4.83459 9.22448 6.51047L8.28075 7.45416L7.71452 8.02039Z" fill="#C6EA4B" />
      <path d="M10.7345 11.0402H9.97949V10.2852C10.5029 9.76182 10.9664 9.29834 11.4895 8.77528C12.2961 7.96868 13.3685 7.52441 14.5093 7.52441C15.65 7.52441 16.7225 7.96861 17.5292 8.77528C17.2651 9.03932 17.0383 9.2662 16.7742 9.53024C16.1498 8.90582 15.3295 8.5936 14.5093 8.5936C13.6891 8.5936 12.8689 8.90582 12.2444 9.53024C11.7217 10.0529 11.2586 10.5161 10.7345 11.0402Z" fill="#55C8FF" />
      <path d="M5.20178 1.58789H6.26947V2.65558H5.20178V1.58789Z" fill="#84DFFF" />
      <path d="M6.26941 3.72266H7.3371V4.79034H6.26941V3.72266Z" fill="#84DFFF" />
      <path d="M13.7433 10.1289H14.811V11.1966H13.7433V10.1289Z" fill="#92E200" />
      <path d="M15.8786 13.3323C15.5052 13.3323 15.1844 13.3323 14.8109 13.3323C14.8109 12.9589 14.8109 12.2646 14.8109 12.2646H15.8786V13.3323Z" fill="#92E200" />
      <path d="M15.8787 4.79102H16.9463V5.8587H15.8787V4.79102Z" fill="#55C8FF" />
      <path d="M11.6079 0.519531H12.6756V1.58722H11.6079V0.519531Z" fill="#C6EA4B" />
      <path d="M13.8213 4.17872L14.9533 3.42037L15.8186 2.18139C15.8985 1.75781 16.2037 1.45533 16.6239 1.37611L17.4268 0.946896L17.6225 0.377463C17.4905 0.245461 17.377 0.132037 17.245 0C16.7316 0.513415 16.1612 0.0771227 15.3404 0.897961C14.6834 1.55491 14.8045 2.14655 14.6557 2.50152C14.5704 2.70509 14.3451 2.93038 14.1415 3.01575C13.8873 3.12231 13.5328 3.08928 13.1062 3.29154C12.7006 3.48383 12.321 3.86329 12.1287 4.26904C11.8355 4.88741 12.0542 5.19074 11.6396 5.60536C11.7717 5.7374 11.8851 5.85082 12.0171 5.98282L12.5165 5.78708L13.0158 4.98414C13.0961 4.55846 13.3962 4.2589 13.8213 4.17872Z" fill="#FC6DAE" />
      <path d="M8.84706 9.15307C8.73478 9.04078 4.97819 5.2842 4.86591 5.17188C4.72067 5.55471 4.59589 5.8837 4.45068 6.26654C4.65308 6.4689 7.88974 9.70563 8.0921 9.90799L8.78777 9.8487L8.84706 9.15307Z" fill="#FCBE00" />
      <path d="M2.16687 12.2871C2.10573 12.4483 0.0610717 17.8387 0 17.9998L2.16687 16.3214L3.93977 14.06C3.72541 13.8456 2.38262 12.5029 2.16687 12.2871Z" fill="#FFD92E" />
      <path d="M6.20475 11.795C5.89003 11.4803 3.74426 9.33459 3.41264 9.00293C3.18689 9.59802 2.71405 10.8446 2.58215 11.1924C2.83886 11.4491 4.4373 13.0475 4.69479 13.305L5.71272 12.798L6.20475 11.795Z" fill="#FFD92E" />
      <path d="M15.1975 3.55771C15.6491 3.10608 15.7089 2.763 15.8186 2.18164C15.12 2.88016 14.5198 3.48041 13.8213 4.17896C14.3689 4.07565 14.7308 4.0244 15.1975 3.55771Z" fill="#F73D7F" />
      <path d="M18 0.755393C17.8679 0.623391 17.7545 0.509967 17.6225 0.37793C17.2732 0.72717 16.9731 1.0273 16.6239 1.37657C16.9874 1.30796 17.4701 1.28525 18 0.755393Z" fill="#F73D7F" />
      <path d="M13.0158 4.98438C12.6665 5.33365 12.3664 5.63381 12.0171 5.98305C12.1491 6.11509 12.2626 6.22852 12.3946 6.36055C12.9068 5.84835 12.938 5.39657 13.0158 4.98438Z" fill="#F73D7F" />
      <path d="M11.7335 13.5497C12.1163 13.4045 12.4453 13.2797 12.8282 13.1345C12.7159 13.0222 8.95932 9.26561 8.847 9.15332C8.58296 9.41736 8.35612 9.64424 8.09204 9.90828C8.29444 10.1106 11.5311 13.3473 11.7335 13.5497Z" fill="#FF9000" />
      <path d="M3.93977 14.0605C3.72121 14.2791 0.218591 17.7817 0 18.0003C0.161185 17.9392 5.55162 15.8945 5.71266 15.8334C5.49831 15.6191 4.15551 14.2763 3.93977 14.0605Z" fill="#FCBE00" />
      <path d="M4.6947 13.3049C4.95141 13.5616 6.54984 15.16 6.80734 15.4175C7.40246 15.1918 8.64906 14.7189 8.99677 14.587C8.68205 14.2723 6.53632 12.1266 6.20466 11.7949C6.02194 11.9776 4.87859 13.121 4.6947 13.3049Z" fill="#FCBE00" />
    </g>
    <defs>
      <clipPath id="clip0_20439_61130">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const CardView = (props) => {
  const theme = useTheme();
  const { sideDrawerOpen, setSideDrawerOpen, cartList, refetch, isLoading } =
    props;
    const dispatch = useDispatch();
  const { configData } = useSelector((state) => state.configData);
  const imageBaseUrl = configData?.base_urls?.item_image_url;
  const router = useRouter();
  const { mutate: clearCartMutate, isLoading: clearCartLoading } = useClearCart();
  const [clearCartConfirmOpen, setClearCartConfirmOpen] = useState(false);

  const handleClearCart = () => {
    clearCartMutate(null, {
      onSuccess: () => {
        dispatch(setClearCart());
        toast.success(t("Cart cleared successfully"));
        refetch();
         setClearCartConfirmOpen(false);
      },
      onError: onErrorResponse,
    });
  };

  const closeHandler = () => {
    setSideDrawerOpen(false);
  };

  const getModuleWiseCartContent = () => {
    return (
      <CartContents
        cartList={getCartListModuleWise(cartList)}
        imageBaseUrl={imageBaseUrl}
        refetch={refetch}
      />
    );
  };

  return (
    <CustomSideDrawer
      anchor="right"
      open={sideDrawerOpen}
      onClose={closeHandler}
      variant="temporary"
      maxWidth="420px"
      width="100%"
    >
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: "100vh" }}
      >
        <DrawerHeader
          CartIcon={
            <CartIcon
              width="18px"
              height="18px"
              color={theme.palette.primary.dark}
            />
          }
          title="Shopping Cart"
          closeHandler={closeHandler}
        />
        {cartList?.length > 0 ? (
          <Stack mt="10px" direction="row" spacing={1} alignItems="center" justifyContent="space-between" width="100%" paddingInline="1.4rem">
            <Typography
              color={theme.palette.primary.main}
              fontSize="14px"
              fontWeight="400"
              sx={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <SavedAmountIcon />
              <span>
                {t("You have Saved")}{" "}
                {getAmountWithSign(
                  cartList?.reduce(
                    (total, item) => total + (item?.discount || 0),
                    0
                  )
                )}
                !
              </span>
            </Typography>
            <Typography
              onClick={() => setClearCartConfirmOpen(true)}
              sx={{ cursor: "pointer" }}
              color={theme.palette.error.main}
              fontSize="14px"
              fontWeight="600"
            >
              {t("Clear Cart")}
            </Typography>
          </Stack>
        ) : null}

        {isLoading ? (
          <Stack height="214px" width="100%" justifyContent="center">
            <DotSpin />
          </Stack>
        ) : getCartListModuleWise(cartList)?.length === 0 ? (
          <EmptyCart
            cartList={getCartListModuleWise(cartList)}
            setSideDrawerOpen={setSideDrawerOpen}
          />
        ) : (
          getModuleWiseCartContent()
        )}

        {getCartListModuleWise(cartList).length > 0 &&
          configData?.free_delivery_over && (
            <>
              <FreeDeliveryProgressBar
                configData={configData}
                cartList={cartList}
              />
            </>
          )}
        {getCartListModuleWise(cartList).length > 0 && (
          <Stack
            width="100%"
            sx={{
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              //pt: 2,
              //px: "1.4rem",
            }}
          >
            <CartTotalPrice cartList={getCartListModuleWise(cartList)} />
            <CartActions
              setSideDrawerOpen={setSideDrawerOpen}
              cartList={getCartListModuleWise(cartList)}
            />
          </Stack>
        )}
        <CustomDialogConfirm
          dialogTexts={t("Are you sure you want to clear cart?")}
          open={clearCartConfirmOpen}
          onClose={() => setClearCartConfirmOpen(false)}
          onSuccess={() => {
            handleClearCart();
          }}
          isLoading={clearCartLoading}
        />
      </CustomStackFullWidth>
    </CustomSideDrawer>
  );
};

export default CardView;
