import React, { useEffect, useState } from "react";
import modalImage from "./asset/modalimage.svg";

import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import H1 from "../../typographies/H1";
import { Stack } from "@mui/system";
import {
  Grid,
  Tooltip,
  Typography,
  IconButton,
  Card,
  alpha,
} from "@mui/material";
import DeliveryInfo from "../DeliveryInfo";
import PaymentMethod from "../PaymentMethod";
import useGetDistance from "../../../api-manage/hooks/react-query/google-api/useGetDistance";
import { useDispatch, useSelector } from "react-redux";
import { useOrderPlace } from "api-manage/hooks/react-query/order-place/useOrderPlace";
import toast from "react-hot-toast";
import { t } from "i18next";
import { baseUrl } from "api-manage/MainApi";
import Router, { useRouter } from "next/router";
import useGetZoneId from "../../../api-manage/hooks/react-query/google-api/useGetZone";
import {
  formatPhoneNumber,
  getDeliveryFeeByBadWeather,
  handleDistance,
} from "utils/CustomFunctions";
import useGetVehicleCharge from "../../../api-manage/hooks/react-query/order-place/useGetVehicleCharge";
import CustomModal from "../../modal";
import CustomImageContainer from "../../CustomImageContainer";
import { useTheme } from "@emotion/react";
import { PrimaryButton } from "../../Map/map.style";
import TrackParcelOrderDrawer from "../../home/module-wise-components/parcel/TrackParcelOrderDrawer";
import { getGuestId, getToken } from "helper-functions/getToken";
import OfflineForm from "../item-checkout/offline-payment/OfflineForm";
import useGetOfflinePaymentOptions from "../../../api-manage/hooks/react-query/offlinePayment/useGetOfflinePaymentOptions";
import {
  setOfflineInfoStep,
  setOrderDetailsModal,
} from "redux/slices/offlinePaymentData";
import { useOfflinePayment } from "api-manage/hooks/react-query/offlinePayment/useOfflinePayment";
import { DeliveryCaption } from "../CheckOut.style";
import {
  getAmountWithSign,
  getReferDiscount,
} from "helper-functions/CardHelpers";
import CustomDivider from "../../CustomDivider";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import useGetDeliveryInstruction from "../../../api-manage/hooks/react-query/order-place/useGetDeliveryInstruction";
import {
  setOrderDetailsModalOpen,
  setOrderInformation,
} from "redux/slices/utils";
import { setGuestUserOrderId } from "redux/slices/guestUserInfo";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetTax } from "api-manage/hooks/react-query/order-place/useGetTax";
import deliveryFree from "components/checkout/DeliveryFree";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useGetSurgePrice } from "api-manage/hooks/react-query/order-place/useGetSurgePrice";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeliveryInstruction from "../DeliveryInstruction";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import LoadingButton from "@mui/lab/LoadingButton";

const ParcelCheckout = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { method, order_id } = router.query;
  const { configData } = useSelector((state) => state.configData);
  const { parcelInfo } = useSelector((state) => state.parcelInfoData);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { offlineInfoStep, offlinePaymentInfo } = useSelector(
    (state) => state.offlinePayment
  );
  console.log({ profileInfo });

  const { parcelCategories } = useSelector((state) => state.parcelCategories);
  const [address, setAddress] = useState(undefined);
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState(paymentMethod);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [paidBy, setPaidBy] = useState("sender");
  const [orderId, setOrderId] = useState("");
  const [selectedInstruction, setSelectedInstruction] = useState(null);
  const [offlineCheck, setOfflineCheck] = useState(false);
  const [zoneIdEnabled, setZoneIdEnabled] = useState(true);
  const [currentZoneId, setCurrentZoneId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditInstructionModal, setOpenEditInstructionModal] =
    useState(false);
  const [customerInstruction, setCustomerInstruction] = useState(null);
  const [check, setCheck] = React.useState(null);
  const [customNote, setCustomNote] = useState("");
  const receiverLoacation = {
    lat: parcelInfo?.senderLocations?.lat,
    lng: parcelInfo?.senderLocations?.lng,
  };
  const { data: zoneData } = useGetZoneId(receiverLoacation, zoneIdEnabled);
  const { data, refetch } = useGetDistance(
    parcelInfo?.senderLocations,
    parcelInfo?.receiverLocations
  );
  console.log({ parcelInfo });

  const { data: surgePrice, mutate: surgeMutate } = useGetSurgePrice();
  const token = getToken();
  const guest_id = getGuestId();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("Password is required"))
        .min(8, t("Password is too short - should be 8 chars minimum.")),
      confirm_password: Yup.string()
        .required(t("Confirm Password"))
        .oneOf([Yup.ref("password"), null], t("Passwords must match")),
    }),
  });
  const passwordHandler = (value) => {
    formik.setFieldValue("password", value);
  };
  const confirmPasswordHandler = (value) => {
    formik.setFieldValue("confirm_password", value);
  };
  const tempDistance = handleDistance(
    data,
    {
      latitude: parcelInfo?.receiverLocations?.latitude,
      longitude: parcelInfo?.receiverLocations?.longitude,
    },
    address
  );
  const {
    data: offlinePaymentOptions,
    refetch: refetchOfflinePaymentOptions,
    isLoading: offlineIsLoading,
  } = useGetOfflinePaymentOptions();
  useEffect(() => {
    refetchOfflinePaymentOptions();
  }, []);
  const { mutate: offlineMutate, isLoading: offlinePaymentLoading } =
    useOfflinePayment();
  const {
    data: extraCharge,
    isLoading: extraChargeLoading,
    refetch: extraChargeRefetch,
  } = useGetVehicleCharge({ tempDistance });
  const {
    data: deliveryInstruction,
    isLoading: deliveryInstructionIsLoading,
    refetch: deliveryInstructionRefetch,
  } = useGetDeliveryInstruction();
  useEffect(() => {
    if (data) {
      extraChargeRefetch();
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [parcelInfo]);
  useEffect(() => {
    deliveryInstructionRefetch();
  }, []);

  useEffect(() => {
    const currentLatLng = JSON.parse(localStorage.getItem("currentLatLng"));
    const location = localStorage.getItem("location");
    const zoneId = JSON.parse(localStorage.getItem("zoneid"));
    setCurrentZoneId(zoneId?.[0]);
    setAddress({
      ...currentLatLng,
      latitude: currentLatLng?.lat,
      longitude: currentLatLng?.lng,
      address: parcelInfo?.senderAddress,
      address_type: "Selected Address",
    });
  }, []);
  const handleOffineOrder = async (data) => {
    const offlinePaymentData = {
      ...(data || offlinePaymentInfo),
      order_id: orderId || order_id,
      guest_id: guest_id,
    };
    dispatch(setOfflineInfoStep(3));
    dispatch(setOrderDetailsModal(true));
    if (offlinePaymentData) {
      try {
        await offlineMutate(offlinePaymentData, {
          onSuccess: () => {
            if (!token) {
              Router.push(
                {
                  pathname: "/home",
                  query: { order_id: orderId || order_id },
                },
                undefined,
                { shallow: true }
              );
            } else {
              Router.push(
                {
                  pathname: "/profile",
                  query: {
                    orderId: orderId || order_id,
                    page: "my-orders",
                    from: "checkout",
                  },
                },
                undefined,
                { shallow: true }
              );
            }
          },
          onError: onErrorResponse,
        });
        setOrderSuccess(true);
      } catch (error) {
        // toast.error(error?.response?.data?.message || t("Failed to process offline payment"));
      }
    }
  };
  const zoneId = JSON.parse(localStorage.getItem("zoneid"));
  useEffect(() => {
    if (parcelCategories && zoneId) {
      const temData = {
        zone_id: zoneId?.[0],
        module_id: parcelCategories?.module_id,
        date_time: new Date().toISOString(),
        guest_id: getGuestId(),
      };
      surgeMutate(temData, {
        onError: onErrorResponse,
      });
    }
  }, [parcelCategories]);
  // useEffect(() => {
  //   if (offlineCheck) {
  //     handleOffineOrder();
  //   }
  // }, [orderId]);
  const parcelDeliveryFree = () => {
    let convertedDistance = handleDistance(
      data,
      parcelInfo?.senderLocations,
      parcelInfo?.receiverLocations
    );
    if (
      parcelCategories?.parcel_per_km_shipping_charge === 0 ||
      parcelCategories?.parcel_per_km_shipping_charge > 0
    ) {
      let deliveryFee =
        convertedDistance * parcelCategories?.parcel_per_km_shipping_charge;
      if (deliveryFee > parcelCategories?.parcel_minimum_shipping_charge) {
        return getDeliveryFeeByBadWeather(
          deliveryFee + extraCharge,
          surgePrice
        );
      } else {
        return getDeliveryFeeByBadWeather(
          parcelCategories?.parcel_minimum_shipping_charge + extraCharge,
          surgePrice
        );
      }
    } else {
      let deliveryFee =
        convertedDistance * configData?.parcel_per_km_shipping_charge;
      if (deliveryFee > configData?.parcel_minimum_shipping_charge) {
        return getDeliveryFeeByBadWeather(
          deliveryFee + extraCharge,
          surgePrice
        );
      } else {
        return getDeliveryFeeByBadWeather(
          configData?.parcel_minimum_shipping_charge + extraCharge,
          surgePrice
        );
      }
    }
  };
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!token;
  const { data: activeOfferRaw } = useGetProActiveOffer({
    enabled: proFeatureEnabled && hasToken,
  });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proMinOrderAmount = Number(proBenefit?.min_order_amount) || 0;
  const proMinSatisfied =
    proBenefit?.min_order_status !== 1 ||
    Number(parcelDeliveryFree() || 0) >= proMinOrderAmount;
  const proDeliveryBenefitActive =
    isProActive &&
    proBenefit?.type === "delivery_fee" &&
    proMinSatisfied &&
    Number(parcelDeliveryFree() || 0) > 0;
  const proDeliveryOfferType = proBenefit?.offer_type;
  const proDeliveryDiscountPct =
    Number(proBenefit?.charge_discount_percentage) || 0;
  const computeProDeliveryDiscount = (rawFee) => {
    if (!proDeliveryBenefitActive) return 0;
    const fee = Number(rawFee) || 0;
    if (
      proDeliveryOfferType === "free" ||
      proDeliveryOfferType === "full_free"
    ) {
      return fee;
    }
    if (proDeliveryOfferType === "partial_free" && proDeliveryDiscountPct > 0) {
      return (fee * proDeliveryDiscountPct) / 100;
    }
    return 0;
  };
  const rawParcelDeliveryFee = Number(parcelDeliveryFree() || 0);
  const proDeliveryDiscount = computeProDeliveryDiscount(rawParcelDeliveryFee);
  const effectiveParcelDeliveryFee = Math.max(
    0,
    rawParcelDeliveryFee - proDeliveryDiscount
  );
  const proCoversDelivery =
    proDeliveryBenefitActive &&
    (proDeliveryOfferType === "free" || proDeliveryOfferType === "full_free") &&
    proDeliveryDiscount > 0;
  const proSavingsMessage = (() => {
    if (!proDeliveryBenefitActive) return undefined;
    // Parcel is delivery-only — keep the qualifier in delivery terms.
    const hasMin = proBenefit?.min_order_status === 1 && proMinOrderAmount > 0;
    const minAmount = hasMin ? getAmountWithSign(proMinOrderAmount) : "";
    if (proCoversDelivery) {
      return hasMin
        ? t("Free delivery as a Pro member on deliveries above {{amount}}", {
            amount: minAmount,
          })
        : t("Free delivery as a Pro member");
    }
    if (proDeliveryDiscountPct > 0) {
      return hasMin
        ? t(
            "{{percent}}% off on delivery fee as a Pro member on deliveries above {{amount}}",
            { percent: proDeliveryDiscountPct, amount: minAmount }
          )
        : t("{{percent}}% off on delivery fee as a Pro member", {
            percent: proDeliveryDiscountPct,
          });
    }
    return hasMin
      ? t(
          "Delivery fee benefit as a Pro member on deliveries above {{amount}}",
          {
            amount: minAmount,
          }
        )
      : t("Delivery fee benefit as a Pro member");
  })();
  console.log({ parcelInfo });

  const receiverDetails = JSON.stringify({
    id: null,
    address_type: "others",
    contact_person_number: `${formatPhoneNumber(parcelInfo?.receiverPhone)}`,
    contact_person_email: parcelInfo?.receiverEmail,
    address: parcelInfo?.receiverAddress,
    additional_address: null,
    latitude: parcelInfo?.receiverLocations?.lat,
    longitude: parcelInfo?.receiverLocations?.lng,
    zone_id: (() => {
      const raw = parcelInfo?.receiverZoneId;
      if (raw == null) return null;
      // The value may arrive as an array ([6]), a JSON-stringified
      // array ("[6]"), or a scalar (6 / "6"). Normalize to a plain
      // string of the first id so the API receives `"6"`, not `"[6]"`.
      let scalar = raw;
      if (Array.isArray(scalar)) scalar = scalar[0];
      else if (typeof scalar === "string") {
        const trimmed = scalar.trim();
        if (trimmed.startsWith("[")) {
          try {
            const parsed = JSON.parse(trimmed);
            scalar = Array.isArray(parsed) ? parsed[0] : parsed;
          } catch {
            scalar = trimmed.replace(/^\[|\]$/g, "");
          }
        }
      }
      return scalar != null ? String(scalar) : null;
    })(),
    zone_ids: null,
    _method: null,
    contact_person_name: parcelInfo?.receiverName,
    road: parcelInfo?.road,
    house: parcelInfo?.house,
    floor: parcelInfo?.floor,
  });
  const isDigital =
    paymentMethod !== "cash_on_delivery" &&
    paymentMethod !== "wallet" &&
    paymentMethod !== "offline_payment" &&
    paymentMethod !== null
      ? "digital_payment"
      : paymentMethod;
  const orderMutationObject = {
    ...address,
    cart: [],
    order_amount: effectiveParcelDeliveryFee + Number(deliveryTip),
    order_type: "parcel",
    payment_method: isDigital,
    distance: tempDistance,
    discount_amount: 0,
    tax_amount: 0,
    receiver_details: receiverDetails,
    parcel_category_id: parcelCategories?.id,
    charge_payer: paidBy,
    dm_tips: deliveryTip,
    guest_id: getGuestId(),
    contact_person_name: parcelInfo?.senderName,
    contact_person_number: `${formatPhoneNumber(parcelInfo?.senderPhone)}`,
    delivery_instruction: customerInstruction,
    sender_zone_id: currentZoneId,
    contact_person_email: parcelInfo?.senderEmail,
    create_new_user: check ? 1 : 0,
    password: formik.values.password,
    is_guest: token ? 0 : 1,
    road: parcelInfo?.senderRoad,
    house: parcelInfo?.senderHouse,
    floor: parcelInfo?.senderFloor,
  };

  const handleEditInstructionClick = () => {
    setOpenEditInstructionModal(!openEditInstructionModal);
  };

  const handleRemoveInstruction = () => {
    setCustomerInstruction(null);
    setSelectedInstruction(null);
    // setCustomNote("");
  };
  const handleRemoveInstructionDes = () => {
    setCustomNote("");
  };

  const { data: order, isLoading, mutate: orderMutation } = useOrderPlace();
  const { data: taxData, mutate } = useGetTax();

  useEffect(() => {
    if (parcelDeliveryFree()) {
      const newOrderObject = {
        ...orderMutationObject,
        order_amount: effectiveParcelDeliveryFee,
      };
      mutate(newOrderObject, {
        onError: onErrorResponse,
      });
    }
  }, [parcelDeliveryFree()]);

  const orderPlace = () => {
    if (paidBy === "sender") {
      const handleSuccess = (res) => {
        if (res) {
          if (token) {
            dispatch(setOrderDetailsModal(true));
          } else {
            dispatch(setGuestUserOrderId(res?.order_id));
            dispatch(
              setOrderInformation({
                ...res,
                phone: formatPhoneNumber(parcelInfo?.senderPhone),
              })
            );
            dispatch(setOrderDetailsModalOpen(true));
          }
          if (
            paymentMethod !== "cash_on_delivery" &&
            paymentMethod !== "offline_payment" &&
            paymentMethod !== "" &&
            paymentMethod !== "wallet"
          ) {
            const payment_platform = "web";
            const page = "my-orders";
            localStorage.setItem("totalAmount", res?.total_ammount);
            const callBackUrl = token
              ? `${window.location.origin}/profile?page=${page}`
              : `${window.location.origin}/home`;
            const url = `${baseUrl}/payment-mobile?order_id=${
              res?.order_id
            }&customer_id=${
              profileInfo?.id ?? res?.user_id ? res?.user_id : guest_id
            }&payment_platform=${payment_platform}&callback=${callBackUrl}&payment_method=${paymentMethod}`;
            router.push(url, undefined, { shallow: true });
          } else if (paymentMethod === "wallet") {
            if (
              Number(profileInfo?.wallet_balance) <
              Number(effectiveParcelDeliveryFee)
            ) {
              toast.error(t("Wallet balance is below total amount."), {
                id: "wallet",
                position: "bottom-right",
              });
            } else {
              toast.success(res?.message);
              //setOpenModal(true);
              Router.push(
                {
                  pathname: "/profile",
                  query: {
                    orderId: res?.order_id,
                    page: "my-orders",
                    from: "checkout",
                  },
                },
                undefined,
                { shallow: true }
              );
            }
          } else if (paymentMethod === "offline_payment") {
            setOrderId(res?.order_id);
            dispatch(
              setOrderInformation({
                ...res,
                phone: formatPhoneNumber(parcelInfo?.senderPhone),
              })
            );
            // setOfflineCheck(true);
            toast.success(res?.message);
            console.log("offline");
            Router.push(
              {
                pathname: "/checkout",
                query: { page: "parcel", method: "offline" },
              },
              undefined,
              { shallow: true }
            );
          } else {
            toast.success(res?.message);
            const token = getToken();
            if (!token) {
              Router.push(
                {
                  pathname: "/home",
                  query: { order_id: res?.order_id },
                },
                undefined,
                { shallow: true }
              );
            } else {
              Router.push(
                {
                  pathname: "/profile",
                  query: {
                    orderId: res?.order_id,
                    page: "my-orders",
                    from: "checkout",
                  },
                },
                undefined,
                { shallow: true }
              );
            }
            setOrderId(res?.order_id);
            //setOpenModal(true);
          }
        }
      };

      orderMutation(orderMutationObject, {
        onSuccess: handleSuccess,
        onError: (error) => {
          error?.response?.data?.errors?.forEach((item) =>
            toast.error(item.message, {
              position: "bottom-right",
            })
          );
        },
      });
    } else {
      dispatch(setOrderDetailsModalOpen(true));
      if (paymentMethod === "cash_on_delivery") {
        const handleSuccess = (res) => {
          if (res) {
            toast.success(res?.message);
            const token = getToken();
            if (!token) {
              setOrderId(res?.order_id);
              dispatch(
                setOrderInformation({
                  ...res,
                  phone: formatPhoneNumber(parcelInfo?.senderPhone),
                })
              );
              Router.push(
                {
                  pathname: "/home",
                  query: { order_id: res?.order_id },
                },
                undefined,
                { shallow: true }
              );
            } else {
              Router.push(
                {
                  pathname: "/profile",
                  query: {
                    orderId: res?.order_id,
                    page: "my-orders",
                    from: "checkout",
                  },
                },
                undefined,
                { shallow: true }
              );
            }
            setOrderId(res?.order_id);
          }
        };

        orderMutation(orderMutationObject, {
          onSuccess: handleSuccess,
          onError: (error) => {
            error?.response?.data?.errors?.forEach((item) =>
              toast.error(item.message, {
                position: "bottom-right",
              })
            );
          },
        });
      } else {
        toast.error(
          t("Without any payment method, you can not place the order.")
        );
      }
    }
  };
  const handleClick = () => {
    setSideDrawerOpen(true);
  };
  const finalTotal = profileInfo?.is_valid_for_discount
    ? effectiveParcelDeliveryFee +
      Number(deliveryTip) +
      (configData?.additional_charge ? configData?.additional_charge : 0) -
      getReferDiscount(
        effectiveParcelDeliveryFee,
        profileInfo?.discount_amount,
        profileInfo?.discount_amount_type
      )
    : effectiveParcelDeliveryFee +
      Number(deliveryTip) +
      (configData?.additional_charge ? configData?.additional_charge : 0);

  const getParcelPayment = () => {
    // Check if zoneData and zone_data are available
    if (!zoneData?.zone_data) return [];

    // Filter the items where module_type is "parcel"
    return zoneData.zone_data.filter((item) =>
      item?.modules?.find((module) => module?.module_type === "parcel")
    );
  };
  const breadcrumbItems = [
    {
      key: "parcel",
      label: t("Parcel"),
      icon: (
        <i
          className="fi fi-rr-home"
          style={{ fontSize: 12, display: "flex", lineHeight: 1 }}
        />
      ),
      onRedirect: "/parcel-delivery-info",
    },
    {
      key: "checkout",
      label: t("Checkout"),
    },
  ];

  const extraText = t("This charge includes extra vehicle charge");
  const proTooltipText =
    proDeliveryBenefitActive && proDeliveryDiscount > 0
      ? ` ${t("Pro discount applied")}: -${getAmountWithSign(
          proDeliveryDiscount
        )}`
      : "";
  const deliveryToolTipsText = `${
    extraCharge > 0 ? `${extraText} ${getAmountWithSign(extraCharge)}` : ""
  }${
    surgePrice?.price > 0 && surgePrice?.customer_note_status !== 0
      ? ` ${surgePrice?.customer_note} ${
          surgePrice?.type === "amount"
            ? getAmountWithSign(surgePrice?.price)
            : `${surgePrice?.price}%`
        }`
      : ""
  }${proTooltipText}`.trim();

  return (
    <>
      {method === "offline" ? (
        <CustomStackFullWidth
          paddingBottom={{ sm: "20px", md: "80px" }}
          pt={{ xs: 0, sm: "1.5rem" }}
          alignItems="center"
        >
          <CustomPaperBigCard
            sx={{ width: { xs: "100%", sm: "90%", md: "80%" } }}
          >
            <OfflineForm
              offlinePaymentOptions={offlinePaymentOptions}
              total_order_amount={
                effectiveParcelDeliveryFee +
                parseFloat(deliveryTip) +
                configData?.additional_charge
              }
              placeOrder={orderPlace}
              offlinePaymentLoading={offlinePaymentLoading || isLoading}
              handleOffineOrder={handleOffineOrder}
            />
          </CustomPaperBigCard>
        </CustomStackFullWidth>
      ) : (
        <CustomStackFullWidth
          paddingBottom={{ sm: "20px", md: "80px" }}
          pt={{ xs: "1.5rem", sm: "1.5rem" }}
        >
          <Stack paddingBottom={{ xs: "16px", sm: "8px" }}>
            <H1 text="Checkout" textAlign="left" />
          </Stack>
          <Stack paddingBottom={{ xs: "16px", sm: "20px" }}>
            <CustomPageBreadCrumb items={breadcrumbItems} />
          </Stack>
          <CustomStackFullWidth>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={8}>
                <DeliveryInfo
                  configData={configData}
                  parcelInfo={parcelInfo}
                  parcelCategories={parcelCategories}
                  deliveryInstruction={deliveryInstruction}
                  customerInstruction={customerInstruction}
                  setCustomerInstruction={setCustomerInstruction}
                  check={check}
                  setCheck={setCheck}
                  formik={formik}
                  passwordHandler={passwordHandler}
                  confirmPasswordHandler={confirmPasswordHandler}
                  data={data}
                  parcelDeliveryFree={parcelDeliveryFree}
                  senderLocation={parcelInfo?.senderLocations}
                  receiverLocation={parcelInfo?.receiverLocations}
                  extraChargeLoading={extraChargeLoading}
                  deliveryTip={deliveryTip}
                  setDeliveryTip={setDeliveryTip}
                  paidBy={paidBy}
                  setPaidBy={setPaidBy}
                  zoneData={zoneData}
                  setPaymentMethod={setPaymentMethod}
                  paymentMethod={paymentMethod}
                  selectedPaymentMethod={selectedPaymentMethod}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  isLoading={isLoading}
                  orderPlace={orderPlace}
                  // zoneData={{ data: zoneData }}
                  // configData={configData}
                  storeZoneId={currentZoneId}
                  parcel="true"
                  offlinePaymentOptions={offlinePaymentOptions}
                  getParcelPayment={getParcelPayment}
                  walletBalance={profileInfo?.wallet_balance}
                  payableAmount={
                    effectiveParcelDeliveryFee +
                    parseFloat(deliveryTip || 0) +
                    (configData?.additional_charge || 0)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                {currentZoneId && zoneData && (
                  <Card
                    sx={{
                      padding: 0,
                      backgroundColor: theme.palette.background.paper,
                      border: "none",
                      borderRadius: "16px",
                      boxShadow:
                        "0px 4px 16px 0px rgba(17, 24, 39, 0.06), 0px 1px 2px 0px rgba(17, 24, 39, 0.04)",
                      overflow: "hidden",
                    }}
                  >
                    <Stack
                      sx={{ padding: { xs: "16px", md: "20px" } }}
                      gap={1.5}
                    >
                      <Typography
                        fontWeight={700}
                        fontSize={{ xs: "16px", md: "18px" }}
                        color="text.primary"
                      >
                        {t("Billing")}
                      </Typography>

                      {parcelInfo?.name && (
                        <Stack direction="row" alignItems="center" gap={1.5}>
                          {parcelInfo?.image && (
                            <CustomImageContainer
                              src={parcelInfo?.image}
                              height="44px"
                              width="44px"
                              objectfit="contain"
                              borderRadius="8px"
                            />
                          )}
                          <Typography
                            fontWeight={700}
                            fontSize="15px"
                            color="text.primary"
                          >
                            {parcelInfo?.name}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>

                    <Stack
                      sx={{
                        padding: { xs: "0 16px 16px", md: "0 20px 20px" },
                      }}
                      gap={1.5}
                    >
                      {/* {proFeatureEnabled &&
                      hasToken &&
                      isProActive &&
                      proSavingsMessage ? (
                        <ProSavingsBanner message={proSavingsMessage} />
                      ) : null} */}
                      <Stack
                        spacing={1.25}
                        sx={{
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 0,
                          padding: 0,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.75}
                          >
                            <Typography
                              fontSize="14px"
                              color={
                                theme.palette.neutral?.[500] ||
                                theme.palette.text.secondary
                              }
                            >
                              {t("Delivery Fee")}
                              {extraCharge > 0 ||
                              surgePrice?.price > 0 ||
                              (proDeliveryBenefitActive &&
                                proDeliveryDiscount > 0) ? (
                                <Tooltip
                                  title={deliveryToolTipsText}
                                  placement="top"
                                  arrow={true}
                                >
                                  <InfoIcon
                                    sx={{ fontSize: "11px", ml: 0.5 }}
                                  />
                                </Tooltip>
                              ) : null}
                            </Typography>
                            {/* {proCoversDelivery ? (
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: "11px",
                                  px: 0.75,
                                  py: 0.1,
                                  borderRadius: "999px",
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.12
                                  ),
                                  color: theme.palette.primary.main,
                                  fontWeight: 600,
                                }}
                              >
                                {t("Pro")}
                              </Typography>
                            ) : null} */}
                          </Stack>
                          {proDeliveryBenefitActive &&
                          proDeliveryDiscount > 0 &&
                          rawParcelDeliveryFee > 0 ? (
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="flex-end"
                              spacing={0.5}
                            >
                              <Typography
                                sx={{
                                  textDecoration: "line-through",
                                  opacity: 0.6,
                                }}
                              >
                                {getAmountWithSign(rawParcelDeliveryFee)}
                              </Typography>
                              <Typography color="primary" fontWeight={600}>
                                {effectiveParcelDeliveryFee === 0
                                  ? t("Free")
                                  : getAmountWithSign(
                                      effectiveParcelDeliveryFee
                                    )}
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography
                              fontSize="14px"
                              fontWeight={500}
                              color="text.primary"
                            >
                              {getAmountWithSign(rawParcelDeliveryFee)}
                            </Typography>
                          )}
                        </Stack>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            fontSize="14px"
                            color={
                              theme.palette.neutral?.[500] ||
                              theme.palette.text.secondary
                            }
                          >
                            {t("Delivery Man Tips")}
                          </Typography>
                          <Typography
                            fontSize="14px"
                            fontWeight={500}
                            color="text.primary"
                          >
                            {getAmountWithSign(deliveryTip)}
                          </Typography>
                        </Stack>
                        {taxData?.tax_included !== null &&
                        taxData?.tax_included === 0 ? (
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              fontSize="14px"
                              color={
                                theme.palette.neutral?.[500] ||
                                theme.palette.text.secondary
                              }
                            >
                              {t("VAT/TAX")}
                            </Typography>
                            <Typography
                              fontSize="14px"
                              fontWeight={500}
                              color="text.primary"
                            >
                              {taxData?.tax_included === 0 && <>{"(+)"}</>}
                              {getAmountWithSign(taxData?.tax_amount)}
                            </Typography>
                          </Stack>
                        ) : null}
                        {configData?.additional_charge_status === 1 && (
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              fontSize="14px"
                              color={
                                theme.palette.neutral?.[500] ||
                                theme.palette.text.secondary
                              }
                              sx={{
                                textTransform: "capitalize",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {configData?.additional_charge_name}
                            </Typography>
                            <Typography
                              fontSize="14px"
                              fontWeight={500}
                              color="text.primary"
                            >
                              {getAmountWithSign(configData?.additional_charge)}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={2}
                      sx={{
                        padding: { xs: "16px", md: "20px" },
                        borderTop: `1px solid ${
                          theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)"
                        }`,
                      }}
                    >
                      <Stack>
                        <Typography
                          fontSize="13px"
                          color={
                            theme.palette.neutral?.[500] ||
                            theme.palette.text.secondary
                          }
                        >
                          {t("Subtotal")}
                          {taxData?.tax_included === 1 &&
                            taxData?.tax_included !== null && (
                              <Typography
                                fontSize="11px"
                                component="span"
                                sx={{ marginInlineStart: "5px" }}
                                color={
                                  theme.palette.neutral?.[500] ||
                                  theme.palette.text.secondary
                                }
                              >
                                {"(Vat/Tax incl.)"}
                              </Typography>
                            )}
                        </Typography>
                        <Typography
                          fontSize="18px"
                          fontWeight={700}
                          color="text.primary"
                        >
                          {getAmountWithSign(
                            effectiveParcelDeliveryFee +
                              Number(deliveryTip) +
                              taxData?.tax_amount +
                              (configData?.additional_charge
                                ? configData?.additional_charge
                                : 0)
                          )}
                        </Typography>
                      </Stack>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        onClick={orderPlace}
                        loading={isLoading}
                        sx={{
                          borderRadius: "10px",
                          height: "44px",
                          px: 3,
                          fontWeight: 700,
                          fontSize: "14px",
                          textTransform: "capitalize",
                          boxShadow: "none",
                          "&:hover": { boxShadow: "none" },
                        }}
                      >
                        {t("Confirm Order")}
                      </LoadingButton>
                    </Stack>
                  </Card>
                )}
              </Grid>
            </Grid>
          </CustomStackFullWidth>
          {openModal && (
            <CustomModal
              openModal={openModal}
              handleClose={() => setOpenModal(false)}
            >
              <CustomPaperBigCard>
                <CustomStackFullWidth
                  justifyContent="center"
                  spacing={2}
                  alignItem="center"
                >
                  <CustomImageContainer src={modalImage.src} />
                  <Typography
                    textAlign="center"
                    color={theme.palette.primary.main}
                    fontSize="20px"
                    fontWeight="700"
                  >
                    {t("Congratulations!")}
                  </Typography>
                  <Typography
                    textAlign="center"
                    maxWidth="400px"
                    color={theme.palette.neutral[400]}
                  >
                    {t(
                      "Your parcel request submitted successfully! to check your parcel status please track order."
                    )}
                  </Typography>
                  <PrimaryButton onClick={handleClick}>
                    {t("Track Order")}
                  </PrimaryButton>
                </CustomStackFullWidth>
              </CustomPaperBigCard>
            </CustomModal>
          )}
          {sideDrawerOpen && (
            <TrackParcelOrderDrawer
              orderId={orderId}
              sideDrawerOpen={sideDrawerOpen}
              setSideDrawerOpen={setSideDrawerOpen}
            />
          )}
        </CustomStackFullWidth>
      )}
    </>
  );
};

export default ParcelCheckout;
