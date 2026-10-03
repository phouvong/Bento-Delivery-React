import { NoSsr, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getApiMessage } from "api-manage/getApiContent";
import { baseUrl } from "api-manage/MainApi";
import useGetLastOrderWithoutReview from "api-manage/hooks/react-query/review/useGetLastOrderWithoutReview";
import useReviewReminderCancel from "api-manage/hooks/react-query/review/useReviewReminderCancel";
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";
import CashBackPopup from "components/cash-back-popup/CashBackPopup";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getGuestId, getToken } from "helper-functions/getToken";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { t } from "i18next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterData,
  setStoreSelectedItems,
  setStoreSelectedItems2,
} from "redux/slices/categoryIds";
import { setWelcomeModal } from "redux/slices/utils";
import { setWishList } from "redux/slices/wishList";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import PushNotificationLayout from "../PushNotificationLayout";
import CustomModal from "../modal";
import LastOrderReview from "./LastOrderReview";
import SearchWithTitle from "./SearchWithTitle";
import Grocery from "./module-wise-components/Grocery";
import Shop from "./module-wise-components/ecommerce";
import FoodModule from "./module-wise-components/food";
import Parcel from "./module-wise-components/parcel/Index";
import Pharmacy from "./module-wise-components/pharmacy/Pharmacy";

import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import useGetOfflinePaymentOptions from "api-manage/hooks/react-query/offlinePayment/useGetOfflinePaymentOptions";
import { useUpdatePaymentMethod } from "api-manage/hooks/react-query/payment-method/useUpdatePaymentMethod";
import { useGetWishList } from "api-manage/hooks/react-query/rental-wishlist/useGetWishlist";
import { useGetFailedPayment } from "api-manage/hooks/react-query/useGetFailedPayment";
import { useUpdatePaymentByWallet } from "api-manage/hooks/react-query/useUpdatePaymentByWallet";
import PaymentMethod from "components/checkout/PaymentMethod";
import ScrollUpButton from "components/common/ScrollUpButton";
import IncompleteOrderModal from "components/home/IncompleteOrderModal";
import { resolveFailedPayment } from "helper-functions/failedPayment";
import {
  followPaymentRedirect,
  getRedirectLink,
} from "helper-functions/paymentRedirect";
import useMakePayment from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/details/useMakePayment";
import Rental from "components/home/module-wise-components/rental/Rental";
import ServiceModule from "components/home/module-wise-components/service/Service";
import TaxiSearchPanel from "components/home/module-wise-components/rental/components/global/search/TaxiSearchPanel";
import {
  getDigitalMethodFromZone,
  handleFailedOrderPlace,
} from "utils/CustomFunctions";
import TopBanner from "./top-banner";
import ModuleSearchBanner from "./module-wise-components/shared/ModuleSearchBanner";
import RideShareModuleLandingPage from "./module-wise-components/rideShare";

export const HomeComponentsWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  gap: "8px",
}));

const HomePageComponents = ({
  configData,
  landingPageData,
  routeSection,
  routeCategory,
}) => {
  const [wishListsData, setWishListsData] = useState();
  const [orderId, setOrderId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openIncompleteOrder, setOpenIncompleteOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const { profileInfo } = useSelector((state) => state.profileInfo);
  const router = useRouter();
  const dispatch = useDispatch();
  const token = getToken();
  const { welcomeModal } = useSelector((state) => state.utilsData);
  const moduleType = getCurrentModuleType();
  const { refetch: refetchFailedPayment, data: failPayment } =
    useGetFailedPayment("", (res) => {
      if (res) {
        // Rental answers with `trip_id`, mart/parcel with `order_id`.
        const orderId = resolveFailedPayment(res)?.id;
        const isHidden = localStorage.getItem(
          `incomplete_order_hidden_${orderId}`
        );
        if (!isHidden) {
          setOpenIncompleteOrder?.(true);
        }
      }
    });
  const [currentLatLng, setCurrentLatLng] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLatLng = JSON.parse(
        window.localStorage.getItem("currentLatLng")
      );
      setCurrentLatLng(storedLatLng);
    }
  }, []);

  // Shares the header's cache entry instead of issuing a second identical
  // get-zone-id request under a differently-shaped query key.
  const { data: zoneContent } = useGetZoneId(currentLatLng, !!currentLatLng);
  // Downstream helpers below still read `zoneData?.data`. Memoised so the
  // wrapper keeps a stable identity across renders.
  const zoneData = useMemo(() => ({ data: zoneContent }), [zoneContent]);
  const { mutate: paymentMethodUpdateMutation, isLoading: repayOrderLoading } =
    useUpdatePaymentMethod();
  const { mutate: walletPaymentMutation } = useUpdatePaymentByWallet();
  const {
    data: offlinePaymentOptions,
    refetch: refetchOfflinePaymentOptions,
    isLoading: offlineIsLoading,
  } = useGetOfflinePaymentOptions();
  const failedPayment = resolveFailedPayment(failPayment);
  const { mutate: rentalPayMutate } = useMakePayment();
  const isZoneDigital = getDigitalMethodFromZone(
    failedPayment?.zoneId,
    zoneData?.data
  );
  useEffect(() => {
    refetchFailedPayment();
    refetchOfflinePaymentOptions();
  }, []);

  const zoneid =
    typeof window !== "undefined" ? localStorage.getItem("zoneid") : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.query.search]);

  const onSuccessHandler = (response) => {
    setWishListsData(response);
    dispatch(setWishList(response));
  };
  const { refetch } = useWishListGet({}, false, onSuccessHandler);
  const { refetch: rentalWishlistRefetch } = useGetWishList(onSuccessHandler);

  useEffect(() => {
    if (token) {
      if (moduleType === "rental") {
        rentalWishlistRefetch();
      } else {
        refetch();
      }
    }
  }, [token]);

  const { refetch: lastReviewRefetch, data } = useGetLastOrderWithoutReview(
    (res) => {
      if (
        res?.order_id &&
        !localStorage.getItem(`last_order_review_hidden_${res.order_id}`)
      ) {
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
        return <Grocery configData={configData} routeSection={routeSection} />;
      case ModuleTypes.PHARMACY:
        return <Pharmacy configData={configData} routeSection={routeSection} />;
      case ModuleTypes.ECOMMERCE:
        return <Shop configData={configData} routeSection={routeSection} />;
      case ModuleTypes.FOOD:
        return (
          <FoodModule
            configData={configData}
            routeSection={routeSection}
            routeCategory={routeCategory}
          />
        );
      case ModuleTypes.PARCEL:
        return <Parcel configData={configData} />;
      case ModuleTypes.RENTAL:
        return (
          <Rental configData={configData} landingPageData={landingPageData} />
        );
      case ModuleTypes.SERVICE:
        return (
          <ServiceModule configData={configData} routeSection={routeSection} />
        );
      case ModuleTypes.RIDE:
        return (
          <RideShareModuleLandingPage
            configData={configData}
            landingPageData={landingPageData}
          />
        );
      default:
        return null;
    }
  };

  const handleClose = () => {
    if (orderId) {
      localStorage.setItem(`last_order_review_hidden_${orderId}`, "1");
      cancelReviewRefetch();
    }
  };

  const handleRateButtonClick = () => {
    router.push(
      {
        pathname: "/profile",
        query: { orderId, page: "my-orders" },
      },
      undefined,
      { shallow: true }
    );
  };
  const handleCloseWelcomeModal = () => {
    dispatch(setWelcomeModal(false));
  };
  const handlePayment = (mutation) => {
    const handleSuccess = (response) => {
      // The order APIs hand back an axios response, so the message sits at
      // `data.message`; the rental hook hands back the payload itself.
      const message = getApiMessage(response);
      if (message) toast.success(message);
    };

    const formData = {
      order_id: failedPayment?.id,
      _method: "put",
    };

    mutation(formData, {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
    });
  };
  // Rental retries go to `rental/user/trip/payment`: cash/wallet settle in
  // place, a gateway answers with the redirect URL to push.
  const rentalPayment = ({ paymentMethod: method, failed }) => {
    rentalPayMutate(
      {
        trip_id: failed.id,
        payment_method: method === "cash_on_delivery" ? "cash_payment" : method,
        payment_gateway:
          method === "cash_on_delivery" ? "cash_payment" : method,
        callback_url: `${window.location.origin}/rental/trip-status/${failed.id}`,
        payment_platform: "web",
        guest_id: getGuestId(),
      },
      {
        onSuccess: (response) => {
          if (method === "cash_on_delivery" || method === "wallet") {
            const message = getApiMessage(response);
            if (message) toast.success(message);
            refetchFailedPayment();
          } else {
            // The gateway link rides inside the v4.2 `content`, so resolve it
            // rather than pushing the payload itself.
            const redirect = getRedirectLink(response);
            if (!redirect) {
              toast.error(t("Payment gateway did not return a redirect link."));
              return;
            }
            followPaymentRedirect(redirect, router);
          }
          setOpenPaymentModal(false);
        },
        onError: onErrorResponse,
      }
    );
  };
  const failedOrderPlace = () => {
    handleFailedOrderPlace({
      paymentMethod,
      paymentFailedData: failPayment,
      handlePayment,
      paymentMethodUpdateMutation,
      walletPaymentMutation,
      profileInfo,
      orderId: failedPayment?.id,
      baseUrl,
      router,
      rentalPayment,
    });
  };

  return (
    <PushNotificationLayout>
      <NoSsr>
        <CustomStackFullWidth>
          {/* Food/Grocery/Pharmacy/Ecommerce handle banner+search inside their own sidebar layout */}

          <Box
            width="100%"
            sx={{
              mt:
                moduleType === "rental" || moduleType === "parcel"
                  ? { xs: 0, md: "34px" }
                  : { xs: "34px", md: "34px" },
            }}
          >
            {getModuleWiseComponents()}
          </Box>
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
                {t("Welcome to ! {{name}}", {
                  name: configData?.business_name,
                })}
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
        {token &&
          failPayment &&
          !(Array.isArray(failPayment) && failPayment.length === 0) && (
            <CustomModal
              handleClose={() => {
                setOpenIncompleteOrder(false);
                localStorage.setItem(
                  "incompleteOrderModalClosedAt",
                  Date.now().toString()
                );
                // Permanently hide this specific incomplete order once the
                // user dismisses the modal — the check at line 83
                // (`incomplete_order_hidden_${orderId}`) then short-circuits
                // any future renders for that order.
                const hiddenOrderId = failedPayment?.id;
                if (hiddenOrderId != null) {
                  localStorage.setItem(
                    `incomplete_order_hidden_${hiddenOrderId}`,
                    "1"
                  );
                }
              }}
              openModal={openIncompleteOrder}
              closeButton
            >
              <IncompleteOrderModal
                dontShowAgain={dontShowAgain}
                setDontShowAgain={setDontShowAgain}
                setOpenPaymentModal={setOpenPaymentModal}
                setOpenIncompleteOrder={setOpenIncompleteOrder}
                failPaymentOrderData={failPayment}
              />
            </CustomModal>
          )}
        <CustomModal
          openModal={openPaymentModal}
          handleClose={() => setOpenPaymentModal(false)}
        >
          <PaymentMethod
            setPaymentMethod={setPaymentMethod}
            paymentMethod={paymentMethod}
            zoneData={zoneData}
            configData={configData}
            orderType={failedPayment?.orderType}
            usePartialPayment={false}
            setOpenModel={setOpenPaymentModal}
            forprescription={failedPayment?.prescriptionOrder}
            offlinePaymentOptions={offlinePaymentOptions}
            paymentMethodImage={null}
            setPaymentMethodImage={null}
            setSwitchToWallet={null}
            isZoneDigital={isZoneDigital}
            handlePartialPayment={() => setPaymentMethod("wallet")}
            walletBalance={profileInfo?.wallet_balance}
            removePartialPayment={null}
            switchToWallet={null}
            customerData={{ data: profileInfo }}
            failed
            payableAmount={failedPayment?.dueAmount}
            failedOrderPlace={failedOrderPlace}
          />
        </CustomModal>
        <ScrollUpButton />
      </NoSsr>
    </PushNotificationLayout>
  );
};

export default React.memo(HomePageComponents);
