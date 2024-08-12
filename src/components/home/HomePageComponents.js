import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { styled, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";

import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";
import useGetLastOrderWithoutReview from "api-manage/hooks/react-query/review/useGetLastOrderWithoutReview";
import useReviewReminderCancel from "api-manage/hooks/react-query/review/useReviewReminderCancel";

import { setWishList } from "redux/slices/wishList";
import {
  setFilterData,
  setStoreSelectedItems,
  setStoreSelectedItems2,
} from "redux/slices/categoryIds";

import PushNotificationLayout from "../PushNotificationLayout";
import CustomModal from "../modal";
import CashBackPopup from "components/cash-back-popup/CashBackPopup";
import LastOrderReview from "./LastOrderReview";
import TopBanner from "./top-banner";
import SearchWithTitle from "./SearchWithTitle";
import SearchResult from "./search";
import Grocery from "./module-wise-components/Grocery";
import Pharmacy from "./module-wise-components/pharmacy/Pharmacy";
import Shop from "./module-wise-components/ecommerce";
import FoodModule from "./module-wise-components/food";
import Parcel from "./module-wise-components/parcel/Index";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getToken } from "helper-functions/getToken";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { t } from "i18next";
import { setWelcomeModal } from "redux/slices/utils";
import { removeSpecialCharacters } from "utils/CustomFunctions";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";

export const HomeComponentsWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  gap: "8px",
}));

const HomePageComponents = ({ configData }) => {
  const [wishListsData, setWishListsData] = useState();
  const [orderId, setOrderId] = useState(null);
  const [open, setOpen] = useState(false);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { modules } = useSelector((state) => state.storedData);
  const { welcomeModal } = useSelector((state) => state.utilsData);
  const zoneid =
    typeof window !== "undefined" ? localStorage.getItem("zoneid") : undefined;
  const token = getToken();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSuccessHandler = (response) => {
    setWishListsData(response);
    dispatch(setWishList(response));
  };
  const { refetch } = useWishListGet(onSuccessHandler);

  useEffect(() => {
    if (token) refetch();
  }, [token]);

  const { refetch: lastReviewRefetch, data } = useGetLastOrderWithoutReview(
    (res) => {
      if (res?.order_id) {
        setOrderId(res.order_id);
        setOpen(true);
      }
    }
  );

  useEffect(() => {
    if (token) lastReviewRefetch();
  }, [token]);

  const { refetch: cancelReviewRefetch } = useReviewReminderCancel(
    () => setOpen(false),
    orderId
  );

  useEffect(() => {
    if (!router.query.data_type) {
      dispatch(setStoreSelectedItems([]));
      dispatch(setStoreSelectedItems2([]));
      dispatch(setFilterData([]));
    }
  }, [router.query.data_type]);

  const getModuleWiseComponents = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return <Grocery configData={configData} />;
      case ModuleTypes.PHARMACY:
        return <Pharmacy configData={configData} />;
      case ModuleTypes.ECOMMERCE:
        return <Shop configData={configData} />;
      case ModuleTypes.FOOD:
        return <FoodModule configData={configData} />;
      case ModuleTypes.PARCEL:
        return <Parcel configData={configData} />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    if (orderId) {
      cancelReviewRefetch();
    }
  };

  const handleRateButtonClick = () => {
    router.push(`/rate-and-review/${orderId}`, undefined, { shallow: true });
  };
  const handleCloseWelcomeModal = () => {
    dispatch(setWelcomeModal(false));
  };

  return (
    <PushNotificationLayout>
      <CustomStackFullWidth>
        <CustomStackFullWidth sx={{ position: "relative" }}>
          <TopBanner />
          <CustomStackFullWidth
            alignItems="center"
            justifyContent="center"
            sx={{ position: "absolute", top: 0, height: "100%" }}
          >
            <SearchWithTitle
              zoneid={zoneid}
              token={token}
              query={removeSpecialCharacters(router.query.search)}
              name={router.query.name}
            />
          </CustomStackFullWidth>
        </CustomStackFullWidth>
        {router.query.data_type ? (
          <SearchResult
            key={router.query.id}
            searchValue={router.query.search}
            name={router.query.name}
            isSearch={router.query.fromSearch}
            routeTo={router.query.from}
            configData={configData}
          />
        ) : (
          <Box width="100%">{getModuleWiseComponents()}</Box>
        )}
      </CustomStackFullWidth>
      {open && (
        <CustomModal openModal={open} handleClose={handleClose}>
          <LastOrderReview
            handleClose={handleClose}
            handleRateButtonClick={handleRateButtonClick}
            productImage={data?.images}
          />
        </CustomModal>
      )}
      <CustomModal
        handleClose={handleCloseWelcomeModal}
        openModal={welcomeModal}
        closeButton
      >
        <Box
          sx={{
            maxWidth: "382px",
            width: "95vw",
            px: 1.3,
            pb: 4,
            textAlign: "center",
            img: {
              height: "unset",
            },
          }}
        >
          <img
            src={"/static/sign-up-welcome.svg"}
            alt="welcome"
            width={183}
            height={183}
          />
          <Box maxWidth={"308px"} mx={"auto"} mt={2}>
            <Typography variant="h6" color="primary" mb={2}>
              {t("Welcome to 6amMart!")}
            </Typography>
            <Typography variant="body2" lineHeight={"1.5"}>
              {profileInfo?.is_valid_for_discount
                ? t(
                    `Get ready for a special welcome gift, enjoy a special discount on your first order within`
                  ) +
                  " " +
                  profileInfo?.validity +
                  "."
                : " "}
              {"  "}
              {t(`Start exploring the best services around you.`)}
            </Typography>
          </Box>
        </Box>
      </CustomModal>
      {token && getCurrentModuleType() !== "parcel" && <CashBackPopup />}
    </PushNotificationLayout>
  );
};

export default React.memo(HomePageComponents);
