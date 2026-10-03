import { useTheme } from "@emotion/react";
import { alpha, Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { Stack } from "@mui/system";
import { baseUrl } from "api-manage/MainApi";
import { OrderApi } from "api-manage/another-formated-api/orderApi";
import { ProfileApi } from "api-manage/another-formated-api/profileApi";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import { useOfflinePayment } from "api-manage/hooks/react-query/offlinePayment/useOfflinePayment";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { isBogoCartRow } from "helper-functions/bogoCartRow";
import { isBundleCartRow } from "helper-functions/bundleCartRow";
import { getStoresOrRestaurants } from "helper-functions/getStoresOrRestaurants";
import { getGuestId, getToken } from "helper-functions/getToken";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import moment from "moment/moment";
import Router from "next/router";
import React, { useEffect, useMemo, useReducer, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setClearCart, setRemoveItemFromCart } from "redux/slices/cart";
import {
  setOfflineInfoStep,
  setOfflineMethod,
  setOrderDetailsModal,
} from "redux/slices/offlinePaymentData";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import {
  formatPhoneNumber,
  getDayNumber,
  getDigitalMethodFromZone,
  getFinalTotalPrice,
  getInfoFromZoneData,
  getProductDiscount,
  getTaxableTotalPrice,
  getVariation,
  handleDistance,
  isAvailable,
  isFoodAvailableBySchedule,
} from "utils/CustomFunctions";
import { today, tomorrow } from "utils/formatedDays";
import { cod_exceeds_message } from "utils/toasterMessages";
import useGetOfflinePaymentOptions from "../../../api-manage/hooks/react-query/offlinePayment/useGetOfflinePaymentOptions";
import useGetVehicleCharge from "../../../api-manage/hooks/react-query/order-place/useGetVehicleCharge";
import useGetStoreDetails from "../../../api-manage/hooks/react-query/store/useGetStoreDetails";
import useGetMostTrips from "../../../api-manage/hooks/react-query/useGetMostTrips";
import CustomModal from "../../modal";
import { handleValuesFromCartItems } from "../../product-details/product-details-section/helperFunction";
import { CouponTitle } from "../CheckOut.style";
import DeliveryManTip from "../DeliveryManTip";
import SinglePrescriptionUpload from "../Prescription/SinglePrescriptionUpload";
import MultiPrescriptionRoot from "../Prescription/MultiPrescriptionRoot";
import AddPaymentMethod from "./AddPaymentMethod";
import CheckoutStepper from "./CheckoutStepper";
import DeliveryDetails from "./DeliveryDetails";
import useAreaZipSelection from "api-manage/hooks/react-query/checkout/useAreaZipSelection";
import InstantDelivery from "./InstantDelivery";
import HaveCoupon from "./HaveCoupon";
import OrderCalculation from "./OrderCalculation";
import OrderSummaryDetails from "./OrderSummaryDetails";
import PartialPayment from "./PartialPayment";
import PartialPaymentModal from "./PartialPaymentModal";
import PlaceOrder from "./PlaceOrder";
import { INITIAL_STATE, scheduleReducer } from "./ScheduleReducer";
import OfflineForm from "./offline-payment/OfflineForm";
import useGetCashBackAmount from "api-manage/hooks/react-query/cashback/useGetCashBackAmount";
import { ModuleTypes } from "helper-functions/moduleTypes";
import {
  setGuestUserInfo,
  setGuestUserOrderId,
} from "redux/slices/guestUserInfo";
import {
  setOrderDetailsModalOpen,
  setOrderInformation,
} from "redux/slices/utils";
import CustomImageContainer from "../../CustomImageContainer";
import thunderstorm from "../assets/thunderstorm.svg";
import { useFormik } from "formik";

import * as Yup from "yup";
import { useGetTax } from "api-manage/hooks/react-query/order-place/useGetTax";
export const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

const ItemCheckout = (props) => {
  const { configData, router, page, cartList, campaignItemList, totalAmount } =
    props;
  const theme = useTheme();
  const { order_id } = router?.query;
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [check, setCheck] = React.useState(null);
  const [orderType, setOrderType] = useState("delivery");
  const [quoteUnavailable, setQuoteUnavailable] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [payableAmount, setPayableAmount] = useState(null);
  const [address, setAddress] = useState(undefined);
  const { couponInfo } = useSelector((state) => state.profileInfo);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [numberOfDay, setDayNumber] = useState(getDayNumber(today));
  const [couponDiscount, setCouponDiscount] = useState(null);
  // Express / standard / slightly_delay choice from the radio-card row below
  // DeliveryDetails. Shape: { id, deliveryType, surcharge }. Null when the
  // zone doesn't expose `delivery_options` or order isn't delivery.
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [scheduleAt, setScheduleAt] = useState("now");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total_order_amount, setTotalOrderAmount] = useState(0);
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryFeeBeforeProDiscount, setDeliveryFeeBeforeProDiscount] =
    useState(0);
  const [minDeliveryCharge, setMinDeliveryCharge] = useState(0);
  const [isImageSelected, setIsImageSelected] = useState([]);
  const [prescriptionImages, setPrescriptionImages] = useState([]);
  const [cutlery, setCutlery] = useState(0);
  const [unavailable_item_note, setUnavailable_item_note] = useState(null);
  const [delivery_instruction, setDelivery_instruction] = useState(null);
  const [usePartialPayment, setUsePartialPayment] = useState(false);
  const [switchToWallet, setSwitchToWallet] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openPartialModel, setOpenPartialModel] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [offlineCheck, setOfflineCheck] = useState(false);
  const [cashbackAmount, setCashbackAmount] = useState(null);
  const [isPackaging, setIsPackaging] = useState(false);
  const [packagingCharge, setPackagingCharge] = useState(0);
  const [paymentMethodImage, setPaymentMethodImage] = useState("");
  const isInitialCartRender = useRef(true);
  const previousCartListRef = useRef(cartList);
  const [changeAmount, setChangeAmount] = useState();
  const [state, customDispatch] = useReducer(scheduleReducer, INITIAL_STATE);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const { offlinePaymentInfo } = useSelector((state) => state.offlinePayment);
  // Preferences captured from StoreCartSidebar (packaging / cutlery /
  // unavailable-item choice). Default to safe values when the slice is
  // unset so legacy flows still work.
  const cartPrefs = useSelector((state) => state.cart?.cartPrefs) || {
    extraPackaging: false,
    addCutlery: false,
    unavailableChoice: "remove",
  };
  const [dDistance, setDDistance] = useState(null);
  const token = getToken();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const guest_id = getGuestId();
  const { method } = router.query;
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("Password is required"))
        .min(6, t("Password is too short - should be 6 chars minimum.")),
      confirm_password: Yup.string()
        .required(t("Confirm Password"))
        .oneOf([Yup.ref("password"), null], t("Passwords must match")),
    }),
  });

  const currentModuleType = getCurrentModuleType();
  const storeId =
    page === "campaign"
      ? campaignItemList?.[0]?.store_id
      : cartList?.[0]?.store_id;

  const clearMonthlySubKey = (sid) => {
    if (typeof window === "undefined") return;
    const moduleId = JSON.parse(localStorage.getItem("module") || "null")?.id;
    const resolvedStoreId = sid || storeId;
    if (moduleId && resolvedStoreId) {
      localStorage.removeItem(
        `monthly_subscribe_${moduleId}_${resolvedStoreId}`,
      );
    }
  };
  const {
    data: storeData,
    refetch,
    isFetching: storeDetailsFetching,
  } = useGetStoreDetails(storeId);
  // Area / ZIP selection for zones priced that way. Feeds `checkout-summary`
  // (which is what actually moves the fee) and gates Confirm Order.
  const areaZip = useAreaZipSelection({
    orderType,
    selfDelivery: Number(storeData?.self_delivery_system) === 1,
  });
  const { data: tripsData } = useGetMostTrips();
  const { mutate: offlineMutate, isLoading: offlinePaymentLoading } =
    useOfflinePayment();
  const {
    data: offlinePaymentOptions,
    refetch: refetchOfflinePaymentOptions,
    isLoading: offlineIsLoading,
  } = useGetOfflinePaymentOptions();
  const { mutate: taxMutate, data } = useGetTax();

  const passwordHandler = (value) => {
    formik.setFieldValue("password", value);
  };
  const confirmPasswordHandler = (value) => {
    formik.setFieldValue("confirm_password", value);
  };

  useEffect(() => {
    refetchOfflinePaymentOptions();
  }, []);
  useEffect(() => {
    if (storeId) {
      refetch();
    }
  }, [storeId]);

  const currentLatLng = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem("currentLatLng") || "null");
    } catch (error) {
      return null;
    }
  }, []);

  const zoneLookupLatLng =
    currentLatLng?.lat && currentLatLng?.lng
      ? currentLatLng
      : address?.lat && address?.lng
      ? { lat: address.lat, lng: address.lng }
      : address?.latitude && address?.longitude
      ? { lat: address.latitude, lng: address.longitude }
      : null;
  const { data: zoneData } = useQuery(
    ["zoneId", zoneLookupLatLng],
    // GoogleApi.getZoneId hands back the raw axios response (with the v4.2
    // envelope already unwrapped onto `.data`) — every consumer below reads
    // `zoneData.zone_data` directly, so unwrap that last layer here instead
    // of leaving each call site to do it (most didn't, which is why
    // additional_delivery_option_status/pivot lookups silently came back
    // empty).
    async () => (await GoogleApi.getZoneId(zoneLookupLatLng))?.data,
    {
      retry: 1,
      enabled: Boolean(zoneLookupLatLng?.lat && zoneLookupLatLng?.lng),
    },
  );

  // `stores/details` no longer returns the store's latitude/longitude, so
  // distance-api was being called with `origin_lat=undefined` and answering
  // 422 ("The origin lat must be a number") — and handleDistance's haversine
  // fallback used the same undefined coords, so the delivery fee had no usable
  // distance at all. Only call the API when we actually have both coordinate
  // pairs; otherwise fall back to `distance_km`, which the store payload does
  // still carry.
  const hasStoreCoords =
    storeData?.latitude != null && storeData?.longitude != null;
  const {
    data: distanceApiData,
    refetch: refetchDistance,
    isLoading,
  } = useQuery(
    ["get-distancesss", storeData, address, orderType],
    () => GoogleApi.distanceApi(storeData, address),
    {
      enabled: hasStoreCoords,
      onError: onErrorResponse,
      // Avoids flashing the delivery-fee Skeleton on every address/order-type edit.
      keepPreviousData: true,
    },
  );

  // Present the same axios-ish shape downstream whichever source we used, so
  // every existing `distanceData?.data...` read keeps working.
  const distanceData = useMemo(() => {
    if (distanceApiData?.data?.distanceMeters != null) return distanceApiData;
    if (storeData?.distance_km != null) {
      return { data: { distanceMeters: Number(storeData.distance_km) * 1000 } };
    }
    return distanceApiData;
  }, [distanceApiData, storeData?.distance_km]);

  const tempDistance = handleDistance(
    distanceData?.data,
    { latitude: storeData?.latitude, longitude: storeData?.longitude },
    address,
  );
  useEffect(() => {
    setDDistance(Number(distanceData?.data?.distanceMeters) / 1000);
  }, [distanceData]);

  const {
    data: extraCharge,
    isLoading: extraChargeLoading,
    refetch: extraChargeRefetch,
  } = useGetVehicleCharge({ tempDistance });
  useEffect(() => {
    if (distanceData) {
      extraChargeRefetch();
    }
  }, [distanceData]);
  const handleChange = (event) => {
    setDayNumber(event.target.value);
  };
  //order post api
  const { mutate: orderMutation, isLoading: orderLoading } = useMutation(
    "order-place",
    OrderApi.placeOrder,
  );
  const userOnSuccessHandler = (res) => {};
  const { isLoading: customerLoading, data: customerData } = useQuery(
    ["profile-info"],
    ProfileApi.profileInfo,
    {
      onSuccess: userOnSuccessHandler,
      onError: onSingleErrorResponse,
    },
  );

  useEffect(() => {
    const currentLatLng = JSON.parse(localStorage.getItem("currentLatLng"));
    const location = localStorage.getItem("location");
    setAddress({
      ...currentLatLng,
      latitude: currentLatLng?.lat,
      longitude: currentLatLng?.lng,
      address: location,
      address_type: "Selected Address",
    });
    refetch();
  }, []);

  useEffect(() => {
    const taxAmount = getTaxableTotalPrice(
      cartList,
      couponDiscount,
      storeData?.tax,
      storeData,
    );
    setTaxAmount(taxAmount);
  }, [cartList, couponDiscount, storeData]);

  useEffect(() => {
    const total_order_amount = getFinalTotalPrice(
      cartList,
      couponDiscount,
      taxAmount,
      storeData,
    );
    setTotalOrderAmount(total_order_amount);
  }, [cartList, couponDiscount, taxAmount]);

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
        await offlineMutate(offlinePaymentData);
        setOrderSuccess(true);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            t("Failed to process offline payment"),
        );
      }
    }
  };

  const handleProductList = (productList, totalQty) => {
    return productList.map((cart) => {
      if (isBogoCartRow(cart)) {
        return {
          bogo_group_id: cart?.bogo_details?.bogo_group_id,
          quantity: cart?.quantity,
        };
      }
      if (isBundleCartRow(cart)) {
        return {
          bundle_group_id: cart?.bundle_details?.bundle_group_id,
          quantity: cart?.quantity,
        };
      }
      return {
        add_on_ids:
          cart?.selectedAddons?.length > 0
            ? cart?.selectedAddons?.map((add) => {
                return add.id;
              })
            : [],
        add_on_qtys:
          cart?.selectedAddons?.length > 0
            ? cart?.selectedAddons?.map((add) => add.quantity)
            : [],
        add_ons:
          cart?.selectedAddons?.length > 0
            ? cart?.selectedAddons?.map((add) => {
                return {
                  id: add.id,
                  name: add.name,
                  price: add.price,
                };
              })
            : [],
        item_id: cart?.id,
        item_campaign_id: cart?.available_date_starts ? cart?.id : null,
        item_type: cart?.available_date_starts
          ? "AppModelsItemCampaign"
          : "AppModelsItem",
        price: cart?.price,
        quantity: cart?.quantity,
        variant:
          cart?.module_type === "food" ? getVariation(cart?.variation) : [],
        //new variation form needs to added here
        variation:
          cart?.module_type === "food"
            ? cart?.food_variations?.length > 0
              ? cart?.food_variations?.map((variation) => {
                  return {
                    name: variation.name,
                    values: {
                      label: handleValuesFromCartItems(variation.values),
                    },
                  };
                })
              : []
            : cart?.selectedOption?.length > 0
            ? cart?.selectedOption
            : [],
      };
    });
  };
  // areaZip.summaryParams is keyed `areaId`/`zipCodeId` (useGetCheckoutSummary's
  // param names) — the order-place API wants `area_id`/`zip_code_id`.
  const AREA_ZIP_BACKEND_KEY = { areaId: "area_id", zipCodeId: "zip_code_id" };
  const getAreaZipOrderParams = (summaryParams) =>
    Object.fromEntries(
      Object.entries(summaryParams || {}).map(([key, value]) => [
        AREA_ZIP_BACKEND_KEY[key] ?? key,
        value,
      ]),
    );

  // profileInfo has no `.name` field — it's `f_name`/`l_name` (see
  // delivery-address/index.js, which already builds it this way).
  const profileFullName = [profileInfo?.f_name, profileInfo?.l_name]
    .filter(Boolean)
    .join(" ");

  const handleOrderMutationObject = (carts, productList) => {
    const guestId = getToken() ? "" : guest_id;
    const isDigital =
      paymentMethod !== "cash_on_delivery" &&
      paymentMethod !== "wallet" &&
      paymentMethod !== "offline_payment" &&
      paymentMethod !== ""
        ? "digital_payment"
        : paymentMethod;

    const originData = {
      latitude: storeData?.latitude,
      longitude: storeData?.longitude,
    };
    if (getCurrentModuleType() === "pharmacy") {
      const formData = new FormData();
      formData.append("cart", JSON.stringify(carts));
      if (scheduleAt !== "now") {
        formData.append("schedule_at", scheduleAt);
      }

      formData.append("payment_method", isDigital);
      formData.append("order_type", orderType);

      // Delivery-speed selection (express / standard / slightly_delay).
      // Skipped when a free-delivery coupon is applied — surcharge is moot.
      if (
        selectedDeliveryOption?.id != null &&
        couponDiscount?.coupon_type !== "free_delivery"
      ) {
        formData.append("delivery_id", selectedDeliveryOption.id);
        formData.append("delivery_type", selectedDeliveryOption.deliveryType);
      }

      Object.entries(getAreaZipOrderParams(areaZip.summaryParams)).forEach(
        ([key, value]) => {
          formData.append(key, value);
        },
      );

      formData.append("store_id", storeData?.id);
      if (couponDiscount?.code) {
        formData.append("coupon_code", couponDiscount?.code);
      }

      formData.append("coupon_discount_amount", couponDiscount?.discount);
      formData.append("coupon_discount_title", couponDiscount?.title);

      formData.append("discount_amount", getProductDiscount(productList));
      formData.append(
        "distance",
        handleDistance(distanceData?.data, originData, address),
      );
      if (orderType !== "take_away") {
        formData.append(
          "delivery_duration",
          parseInt(distanceData?.data?.duration, 10) || 0,
        );
      }
      formData.append("order_amount", totalAmount);
      formData.append("dm_tips", deliveryTip);

      formData.append("address", address?.address);
      formData.append("address_type", address?.address_type);
      formData.append("lat", address?.lat);
      formData.append("latitude", address?.latitude);
      formData.append("lng", address?.lng);
      formData.append("longitude", address?.longitude);
      formData.append("guest_id", guestId);
      formData.append(
        "is_buy_now",
        page === "buy_now" || page === "campaign" ? 1 : 0,
      );
      formData.append("house", token ? address?.house : guestUserInfo?.house);
      formData.append("floor", token ? address?.floor : guestUserInfo?.floor);
      formData.append("road", token ? address?.road : guestUserInfo?.road);
      formData.append(
        "contact_person_name",
        token
          ? address?.contact_person_name
            ? address?.contact_person_name
            : profileFullName
          : guestUserInfo?.contact_person_name,
      );
      formData.append(
        "contact_person_number",
        token
          ? address?.contact_person_number
            ? address?.contact_person_number
            : profileInfo?.phone
          : `+${guestUserInfo?.contact_person_number}`,
      );
      formData.append(
        "contact_person_email",
        token
          ? address?.contact_person_email
            ? address?.contact_person_email
            : profileInfo?.email
          : guestUserInfo?.contact_person_email,
      );
      if (prescriptionImages?.length > 0) {
        const filterBinaryImages = prescriptionImages.filter(
          (img) => !img.name,
        );
        const filterUrlImages = prescriptionImages.filter((img) => img.name);
        filterBinaryImages?.length &&
          filterBinaryImages.forEach((image) => {
            formData.append("order_attachment[]", image?.file);
          });
        filterUrlImages?.length &&
          filterUrlImages.forEach((image) => {
            formData.append("saved_images[]", image?.name);
          });
      }
      const resolvedPackagingAmount = cartPrefs?.extraPackaging
        ? packagingCharge > 0
          ? packagingCharge
          : 0
        : 0;
      formData.append("extra_packaging_amount", resolvedPackagingAmount);
      formData.append("cutlery", cartPrefs?.addCutlery ? 1 : cutlery ? 1 : 0);
      formData.append(
        "unavailable_item_note",
        cartPrefs?.unavailableChoice ?? unavailable_item_note ?? "",
      );
      if (cartPrefs?.monthlySubscribe) {
        formData.append("monthly_subscribe", 1);
      }
      formData.append("create_new_user", check ? 1 : 0);
      formData.append("is_guest", token ? 0 : 1);
      formData.append("password", formik.values.password);
      return formData;
    } else {
      const resolvedCutlery = cartPrefs?.addCutlery ? 1 : cutlery ? 1 : 0;
      const resolvedUnavailableNote =
        cartPrefs?.unavailableChoice ?? unavailable_item_note;
      const resolvedPackagingAmount = cartPrefs?.extraPackaging
        ? packagingCharge > 0
          ? packagingCharge
          : 0
        : 0;
      return {
        cart: JSON.stringify(carts),
        ...address,
        ...getAreaZipOrderParams(areaZip.summaryParams),
        is_buy_now: page === "buy_now" || page === "campaign" ? 1 : 0,
        partial_payment: usePartialPayment,
        schedule_at: scheduleAt === "now" ? null : scheduleAt,
        // order_time: scheduleAt,
        payment_method: isDigital,
        order_type: orderType === "schedule_order" ? "delivery" : orderType,
        store_id: storeId,
        coupon_code: couponDiscount?.code,
        coupon_discount_amount: couponDiscount?.discount,
        coupon_discount_title: couponDiscount?.title,
        discount_amount: getProductDiscount(productList),
        distance: dDistance || tempDistance,
        ...(orderType !== "take_away" && {
          delivery_duration: parseInt(distanceData?.data?.duration, 10) || 0,
        }),
        order_amount: totalAmount,
        dm_tips: deliveryTip,
        cutlery: resolvedCutlery,
        unavailable_item_note: resolvedUnavailableNote,
        delivery_instruction: delivery_instruction,
        guest_id: guestId,
        contact_person_name: token
          ? address?.contact_person_name
            ? address?.contact_person_name
            : profileFullName
          : guestUserInfo?.contact_person_name,
        contact_person_number: formatPhoneNumber(
          token
            ? address?.contact_person_number
              ? address?.contact_person_number
              : profileInfo?.phone
            : `${guestUserInfo?.contact_person_number}`,
        ),
        contact_person_email: token
          ? address?.contact_person_email
            ? address?.contact_person_email
            : profileInfo?.email
          : guestUserInfo?.contact_person_email,
        house: token ? address?.house : guestUserInfo?.house,
        floor: token ? address?.floor : guestUserInfo?.floor,
        road: token ? address?.road : guestUserInfo?.road,
        extra_packaging_amount: resolvedPackagingAmount,
        ...(cartPrefs?.monthlySubscribe && { monthly_subscribe: 1 }),
        create_new_user: check ? 1 : 0,
        password: formik.values.password,
        is_guest: token ? 0 : 1,
        bring_change_amount: changeAmount,
        // Delivery-speed selection (express / standard / slightly_delay).
        // Spread conditionally so free-delivery coupons skip the surcharge
        // fields entirely and the backend uses base delivery only.
        ...(selectedDeliveryOption?.id != null &&
          couponDiscount?.coupon_type !== "free_delivery" && {
            delivery_id: selectedDeliveryOption.id,
            delivery_type: selectedDeliveryOption.deliveryType,
          }),
      };
    }
  };

  const prevCartRef = useRef(null);
  const prevCouponRef = useRef(null);

  useEffect(() => {
    if ((!cartList || !storeData) && !storeId) return;

    const cartChanged = !deepEqual(prevCartRef.current, cartList);
    const couponChanged = !deepEqual(prevCouponRef.current, couponDiscount);

    if (cartChanged || couponChanged) {
      prevCartRef.current = cartList;
      prevCouponRef.current = couponDiscount;

      const productList = page === "campaign" ? campaignItemList : cartList;
      const totalQty = 0;
      const carts = handleProductList(productList, totalQty);
      const orderObject = handleOrderMutationObject(carts, productList);
      taxMutate(orderObject, {
        // onError: onErrorResponse,
      });
    }
  }, [cartList, campaignItemList, couponDiscount, storeData]);

  const handlePlaceOrder = () => {
    const itemsList = page === "campaign" ? campaignItemList : cartList;
    const isAvailable =
      storeData?.schedule_order && getCurrentModuleType() === ModuleTypes.FOOD
        ? isFoodAvailableBySchedule(itemsList, scheduleAt)
        : true;

    if (isAvailable) {
      const walletAmount = customerData?.data?.wallet_balance;
      let productList = page === "campaign" ? campaignItemList : cartList;
      if (paymentMethod === "wallet") {
        if (Number(walletAmount) < Number(totalAmount)) {
          toast.error(t("Wallet balance is below total amount."), {
            id: "wallet",
            position: "bottom-right",
          });
        } else {
          let totalQty = 0;
          let carts = handleProductList(productList, totalQty);
          const handleSuccessSecond = (response) => {
            if (response?.data) {
              if (token) {
                dispatch(setOrderDetailsModal(true));
              }
              if (paymentMethod === "digital_payment") {
                toast.success(response?.data?.message);
                const newBaseUrl = baseUrl;
                const page = "my-orders";
                const callBackUrl = token
                  ? `${window.location.origin}/profile?page=${page}`
                  : `${window.location.origin}/order?order_id=${response?.data?.order_id}&total=${response?.data?.total_ammount}`;
                const url = `${newBaseUrl}/payment-mobile?order_id=${
                  response?.data?.order_id
                }&customer_id=${
                  customerData?.data?.id ?? guest_id
                }&callback=${callBackUrl},`;
                localStorage.setItem("totalAmount", totalAmount);
                clearMonthlySubKey(storeId);
                dispatch(setClearCart());
                Router.push(url);
              } else if (paymentMethod === "wallet") {
                toast.success(response?.data?.message);
                setOrderId(response?.data?.order_id);
                setOrderSuccess(true);
              } else {
                if (response.status === 203) {
                  toast.error(response.data.errors[0].message);
                }
                //setOrderSuccess(true)
              }
            }
          };
          if (carts?.length > 0) {
            let order = handleOrderMutationObject(carts, productList);
            orderMutation(order, {
              onSuccess: handleSuccessSecond,
              onError: (error) => {
                error?.response?.data?.errors?.forEach((item) =>
                  toast.error(item.message, {
                    position: "bottom-right",
                  }),
                );
              },
            });
          }
        }
      } else {
        try {
          let totalQty = 0;
          let carts = handleProductList(productList, totalQty);
          const handleSuccess = (response) => {
            if (response?.data) {
              if (token) {
                // dispatch(setOrderDetailsModal(true));
              } else {
                dispatch(setGuestUserOrderId(response?.data?.order_id));
                dispatch(
                  setOrderInformation({
                    ...response?.data,
                    phone: formatPhoneNumber(
                      token
                        ? address?.contact_person_number
                          ? address?.contact_person_number
                          : profileInfo?.phone
                        : `${guestUserInfo?.contact_person_number}`,
                    ),
                  }),
                );
                dispatch(setOrderDetailsModalOpen(true));
                dispatch(setGuestUserInfo(null));
              }
              if (
                paymentMethod === "cash_on_delivery" ||
                paymentMethod === "offline_payment" ||
                paymentMethod === "wallet"
              ) {
                toast.success(response?.data?.message, {
                  id: paymentMethod,
                });
              }
              if (
                paymentMethod !== "cash_on_delivery" &&
                paymentMethod !== "offline_payment"
              ) {
                const payment_platform = "web";
                const page = "my-orders";
                const callBackUrl = token
                  ? `${window.location.origin}/profile?page=${page}`
                  : `${window.location.origin}/home`;
                const url = `${baseUrl}/payment-mobile?order_id=${
                  response?.data?.order_id
                }&customer_id=${
                  customerData?.data?.id ?? response?.data?.user_id
                    ? response?.data?.user_id
                    : guest_id
                }&payment_platform=${payment_platform}&callback=${callBackUrl}&payment_method=${paymentMethod}`;
                localStorage.setItem("totalAmount", totalAmount);
                dispatch(setGuestUserInfo(null));
                dispatch(setOrderDetailsModal(true));
                //dispatch(setClearCart());
                Router.push(url, undefined, { shallow: true });
              } else if (paymentMethod === "offline_payment") {
                toast.success(t("Order is successful placed"), {
                  id: paymentMethod,
                });

                setOrderId(response?.data?.order_id);
                dispatch(
                  setOrderInformation({
                    ...response?.data,
                    phone: formatPhoneNumber(
                      token
                        ? address?.contact_person_number
                          ? address?.contact_person_number
                          : profileInfo?.phone
                        : `${guestUserInfo?.contact_person_number}`,
                    ),
                  }),
                );
                //setOrderSuccess(true);
                //setOfflineCheck(true);
                dispatch(setOfflineInfoStep(2));
                router.push(
                  {
                    pathname: "/checkout",
                    query: { page: page, method: "offline" },
                  },
                  undefined,
                  { shallow: true },
                );
              } else {
                setOrderId(response?.data?.order_id);
                dispatch(
                  setOrderInformation({
                    ...response?.data,
                    phone: formatPhoneNumber(
                      token
                        ? address?.contact_person_number
                          ? address?.contact_person_number
                          : profileInfo?.phone
                        : `${guestUserInfo?.contact_person_number}`,
                    ),
                  }),
                );
                clearMonthlySubKey(storeId);
                setOrderSuccess(true);
                dispatch(setOrderDetailsModal(true));
              }
            }
          };
          if (carts?.length > 0) {
            let order = handleOrderMutationObject(carts, productList);
            orderMutation(order, {
              onSuccess: handleSuccess,
              onError: (error) => {
                error?.response?.data?.errors?.forEach((item) =>
                  toast.error(item.message, {
                    position: "bottom-right",
                  }),
                );
              },
            });
          }
        } catch (error) {
          console.log({ error });
        }
      }
    } else {
      toast.error(
        t(
          "One or more item is not available for the chosen preferable schedule time.",
        ),
      );
    }
  };

  // Literal keys per module — composing the key from the (already translated)
  // getStoresOrRestaurants() output produces a string that never matches a
  // translation entry, so the toast showed untranslated mixed text.
  const storeCloseToast = () =>
    toast.error(
      getCurrentModuleType() === "food"
        ? t("Restaurant is closed. Try again later.")
        : t("Store is closed. Try again later."),
    );
  //totalAmount
  const handlePlaceOrderBasedOnAvailability = () => {
    //cod -> cash on delivery
    const codLimit =
      getInfoFromZoneData(zoneData)?.pivot?.maximum_cod_order_amount;
    if (orderType === "take_away") {
      handlePlaceOrder();
    } else {
      if (codLimit && paymentMethod === "cash_on_delivery") {
        if (totalAmount <= codLimit) {
          handlePlaceOrder();
        } else {
          toast.error(
            `${t(cod_exceeds_message)} ${getAmountWithSign(codLimit)}`,
            { duration: 5000 },
          );
        }
      } else {
        handlePlaceOrder();
      }
    }
  };

  const isSchedules = () => {
    const schedules = storeData?.schedules;
    // `/stores/details` does not return a `schedules` array, so `.length` threw.
    // An absent schedule must not read as "closed" either - that path calls
    // storeCloseToast() and rejects every order. Fall back to the store's own
    // open flag, which the endpoint does return.
    if (!schedules?.length) {
      return Number(storeData?.open) === 1;
    }
    {
      const todayInNumber = moment().weekday();
      let isOpen = false;
      let filteredSchedules = schedules.filter(
        (item) => item.day === todayInNumber,
      );
      let isAvailableNow = [];

      filteredSchedules.forEach((item) => {
        if (isAvailable(item?.opening_time, item?.closing_time)) {
          isAvailableNow.push(item);
        }
      });

      if (isAvailableNow.length > 0) {
        isOpen = true;
      } else {
        isOpen = false;
      }

      return isOpen; // Add this line to return true or false based on whether the store is open.
    }
  };
  const placeOrder = () => {
    // The server refused to quote this delivery (e.g. an area/zip the zone no
    // longer covers). The fee reads 0 out of the empty payload, so placing here
    // would bill a price the server never agreed — stop instead.
    if (quoteUnavailable) {
      toast.error(t("Delivery charge is unavailable for this address"));
      return;
    }
    // Blocked with a message rather than placing an order at an unpriced fee.
    if (!areaZip.validate()) {
      toast.error(t("Please select an area/zip code to continue"));
      return;
    }
    if (storeData?.active) {
      //checking restaurant or shop open or not
      if (isSchedules()) {
        handlePlaceOrderBasedOnAvailability();
      } else {
        storeCloseToast();
      }
    } else {
      storeCloseToast();
    }
  };

  const couponRemove = () => {};
  useEffect(() => {
    if (orderSuccess) {
      handleOrderSuccess();
    }
  }, [orderSuccess]);
  const handleOrderSuccess = () => {
    if (page === "buysetScheduleAt_now") {
      dispatch(setRemoveItemFromCart(cartList?.[0]));
    }
    localStorage.setItem("totalAmount", totalAmount);
    if (!token) {
      Router.push("/home");
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
        { shallow: false },
      );
    }
  };
  const handleImageUpload = (value) => {
    setIsImageSelected([value]);
  };

  const handlePartialPayment = () => {
    if (
      payableAmount > customerData?.data?.wallet_balance &&
      configData?.partial_payment_status === 1
    ) {
      setUsePartialPayment(true);
      setPaymentMethod("");
      dispatch(setOfflineMethod(""));
    } else {
      if (customerData?.data?.wallet_balance > payableAmount) {
        setPaymentMethod("wallet");
        setSwitchToWallet(true);
        dispatch(setOfflineMethod(""));
      } else {
        toast.error(t("Your wallet balance is insufficient for payment."));
      }
    }
  };
  const removePartialPayment = () => {
    if (payableAmount > customerData?.data?.wallet_balance) {
      setUsePartialPayment(false);
      setPaymentMethod("");
      dispatch(setOfflineMethod(""));
    } else {
      setPaymentMethod("");
      setSwitchToWallet(false);
      dispatch(setOfflineMethod(""));
    }
  };
  const handlePartialPaymentCheck = () => {
    if (configData?.partial_payment_status === 1) {
      if (couponDiscount && usePartialPayment) {
        if (
          payableAmount > customerData?.data?.wallet_balance &&
          !usePartialPayment
        ) {
          setOpenPartialModel(true);
        } else {
          if (
            usePartialPayment &&
            customerData?.data?.wallet_balance > payableAmount
          ) {
            setOpenModal(true);
          }
        }
      } else if ((deliveryTip > 0 && usePartialPayment) || switchToWallet) {
        if (payableAmount > customerData?.data?.wallet_balance) {
          setOpenPartialModel(true);
        } else {
          if (
            usePartialPayment &&
            customerData?.data?.wallet_balance > payableAmount
          ) {
            setOpenModal(true);
          }
        }
      } else if (orderType && usePartialPayment) {
        if (
          payableAmount > customerData?.data?.wallet_balance &&
          !usePartialPayment
        ) {
          setOpenPartialModel(true);
        } else {
          if (
            usePartialPayment &&
            customerData?.data?.wallet_balance > payableAmount
          ) {
            setOpenModal(true);
          }
          //setOpenModal(true);
        }
      }
    }
  };
  // Ignores stale onSuccess resolutions from a superseded amount.
  const latestPayableAmountRef = useRef(payableAmount);
  useEffect(() => {
    latestPayableAmountRef.current = payableAmount;
  }, [payableAmount]);
  const handleCashbackAmount = (data) => {
    if (payableAmount !== latestPayableAmountRef.current) return;
    setCashbackAmount(data);
  };
  const { refetch: refetchCashbackAmount } = useGetCashBackAmount({
    amount: payableAmount,
    handleSuccess: handleCashbackAmount,
  });
  useEffect(() => {
    handlePartialPaymentCheck();
    if (payableAmount > 0) {
      refetchCashbackAmount();
    }
  }, [payableAmount]);

  const agreeToPartial = () => {
    setPaymentMethod("");
    setUsePartialPayment(true);
    setOpenPartialModel(false);
    setSwitchToWallet(false);
  };
  const notAgreeToPartial = () => {
    setUsePartialPayment(false);
    setOpenPartialModel(false);
    setSwitchToWallet(false);
  };
  const agreeToWallet = () => {
    setPaymentMethod("wallet");
    setSwitchToWallet(true);
    setUsePartialPayment(false);
    setOpenModal(false);
  };
  const notAgreeToWallet = () => {
    setPaymentMethod("");
    setSwitchToWallet(false);
    setUsePartialPayment(false);
    setOpenModal(false);
  };
  useEffect(() => {
    if (paymentMethod !== "wallet") {
      setSwitchToWallet(false);
    }
  }, [paymentMethod]);

  const currentZoneInfo = zoneData?.zone_data?.find(
    (item) => item.id === storeData?.zone_id,
  );

  const handleBadWeatherUi = (zoneWiseData) => {
    if (currentZoneInfo) {
      if (currentZoneInfo?.increased_delivery_fee_status === 1) {
        return (
          <>
            {currentZoneInfo?.increase_delivery_charge_message && (
              <CustomStackFullWidth
                alignItems="center"
                justifyContent="flex-start"
                gap="10px"
                direction="row"
                mt="10px"
                sx={{
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                  borderRadius: "4px",
                  padding: "5px 10px",
                }}
              >
                <CustomImageContainer
                  height="40px"
                  width="40px"
                  src={thunderstorm.src}
                  objectFit="contained"
                />

                <Typography>
                  {currentZoneInfo?.increase_delivery_charge_message}
                </Typography>
              </CustomStackFullWidth>
            )}
          </>
        );
      }
    }
  };

  const handleExtraPackaging = (e) => {
    setIsPackaging(e.target.checked);
  };

  useEffect(() => {
    if (isPackaging) {
      setPackagingCharge(storeData?.extra_packaging_amount);
    } else {
      setPackagingCharge(0);
    }
  }, [isPackaging, storeData?.extra_packaging_amount]);

  // Seed the local toggle from the sidebar's preference so a user who opted
  // in on the store page stays opted-in here without having to toggle again.
  useEffect(() => {
    if (cartPrefs?.extraPackaging === true) {
      setIsPackaging(true);
    } else if (cartPrefs?.extraPackaging === false) {
      setIsPackaging(false);
    }
  }, [cartPrefs?.extraPackaging]);

  const isZoneDigital = useMemo(() => {
    const zoneDigitalMatch = getDigitalMethodFromZone(
      storeData?.zone_id,
      zoneData,
    );
    return {
      ...zoneDigitalMatch,
      offline_payment: Boolean(configData?.offline_payment_status === 1),
    };
  }, [storeData?.zone_id, zoneData, configData?.offline_payment_status]);

  const hasOnlyPaymentMethod = () => {
    if (
      !configData?.cash_on_delivery &&
      configData?.customer_wallet_status !== 1 &&
      configData?.offline_payment_status !== 1 &&
      configData?.digital_payment &&
      configData?.active_payment_method_list?.length === 1 &&
      isZoneDigital?.digital_payment
    ) {
      setPaymentMethod(configData?.active_payment_method_list[0]?.gateway);
      setPaymentMethodImage(
        configData?.active_payment_method_list[0]?.gateway_image_full_url,
      );
    }
  };

  useEffect(() => {
    hasOnlyPaymentMethod();
  }, [configData, isZoneDigital]);

  useEffect(() => {
    if (isZoneDigital?.cash_on_delivery && configData?.cash_on_delivery) {
      setPaymentMethod("cash_on_delivery");
    }
  }, [isZoneDigital, configData?.cash_on_delivery]);

  useEffect(() => {
    if (isInitialCartRender.current) {
      isInitialCartRender.current = false;
      previousCartListRef.current = cartList;
      return;
    }

    const cartChanged = !deepEqual(previousCartListRef.current, cartList);
    const hasPreviousCartItems = previousCartListRef.current?.length > 0;

    if (cartChanged && hasPreviousCartItems && cartList?.length > 0) {
      setPaymentMethodImage("");
      setPaymentMethod("");
    }

    previousCartListRef.current = cartList;
  }, [cartList]);
  return (
    <Box sx={{ pt: { xs: "1.5rem", md: "24px" } }}>
      {method === "offline" ? (
        <Grid container mb="2rem">
          <Grid item xs={12} md={12}>
            <Typography variant="h5" fontWeight="600">
              {t("Offline Payment Information")}
            </Typography>
            <CustomStackFullWidth
              marginTop={{ xs: "1.5rem", md: "2.5rem" }}
              alignItems="center"
            >
              <CustomPaperBigCard
                sx={{
                  width: { xs: "100%", sm: "90%", md: "80%" },
                  padding: { xs: "1rem", md: "1.8rem" },
                }}
              >
                <OfflineForm
                  offlinePaymentOptions={offlinePaymentOptions}
                  total_order_amount={payableAmount}
                  placeOrder={placeOrder}
                  offlinePaymentLoading={offlinePaymentLoading || orderLoading}
                  usePartialPayment={usePartialPayment}
                  handleOffineOrder={handleOffineOrder}
                  setOfflineCheck={setOfflineCheck}
                />
              </CustomPaperBigCard>
            </CustomStackFullWidth>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3} mb="2rem">
          <Grid item xs={12} md={7}>
            <Stack
              spacing={{ xs: 2, sm: 2, md: 3 }}
              pb={{ xs: "1rem", sm: "2rem", md: "4rem" }}
            >
              <CheckoutStepper storeData={storeData} />
              <DeliveryDetails
                storeData={storeData}
                setOrderType={setOrderType}
                orderType={orderType}
                setAddress={setAddress}
                address={address}
                customDispatch={customDispatch}
                scheduleTime={state.scheduleTime}
                setDayNumber={setDayNumber}
                setDeliveryTip={setDeliveryTip}
                handleChange={handleChange}
                today={today}
                tomorrow={tomorrow}
                numberOfDay={numberOfDay}
                configData={configData}
                setScheduleAt={setScheduleAt}
                formik={formik}
                passwordHandler={passwordHandler}
                confirmPasswordHandler={confirmPasswordHandler}
                check={check}
                setCheck={setCheck}
                isHomeDelivery={
                  configData?.home_delivery_status && storeData?.delivery
                }
                zoneData={zoneData}
                deliveryFee={deliveryFee}
                deliveryFeeBeforeProDiscount={deliveryFeeBeforeProDiscount}
                minDeliveryCharge={minDeliveryCharge}
                couponDiscount={couponDiscount}
                selectedDeliveryOption={selectedDeliveryOption}
                setSelectedDeliveryOption={setSelectedDeliveryOption}
                deliveryOptions={deliveryOptions}
                areaZip={areaZip}
              />

              {Number.parseInt(configData?.dm_tips_status) === 1 &&
                orderType !== "take_away" && (
                  <DeliveryManTip
                    orderType={orderType}
                    deliveryTip={deliveryTip}
                    setDeliveryTip={setDeliveryTip}
                    isSmall={isSmall}
                    tripsData={tripsData}
                    setUsePartialPayment={setUsePartialPayment}
                  />
                )}
              {storeData && token && (
                <HaveCoupon
                  store_id={storeData?.id}
                  setCouponDiscount={setCouponDiscount}
                  counponRemove={couponRemove}
                  couponDiscount={couponDiscount}
                  totalAmount={totalAmount}
                  deliveryFee={deliveryFee}
                  deliveryTip={deliveryTip}
                  setSwitchToWallet={setSwitchToWallet}
                  walletBalance={customerData?.data?.wallet_balance}
                  payableAmount={payableAmount}
                  min_order_amount={storeData?.minimum_order}
                />
              )}

              {zoneData && (
                <AddPaymentMethod
                  setPaymentMethod={setPaymentMethod}
                  paymentMethod={paymentMethod}
                  zoneData={zoneData}
                  configData={configData}
                  orderType={orderType}
                  usePartialPayment={usePartialPayment}
                  offlinePaymentOptions={offlinePaymentOptions}
                  setSwitchToWallet={setSwitchToWallet}
                  isZoneDigital={isZoneDigital}
                  setPaymentMethodImage={setPaymentMethodImage}
                  paymentMethodImage={paymentMethodImage}
                  remainingBalance={
                    customerData?.data?.wallet_balance - payableAmount
                  }
                  handlePartialPayment={handlePartialPayment}
                  walletBalance={customerData?.data?.wallet_balance}
                  removePartialPayment={removePartialPayment}
                  switchToWallet={switchToWallet}
                  customerData={customerData}
                  payableAmount={payableAmount}
                  changeAmount={changeAmount}
                  setChangeAmount={setChangeAmount}
                />
              )}

              <Grid item md={12} xs={12}></Grid>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            height="auto"
            sx={{
              position: { md: "sticky" },
              top: { md: "24px" },
              alignSelf: { md: "flex-start" },
              maxHeight: { md: "calc(100vh - 32px)" },
              // overflowY: { md: "auto" },
            }}
          >
            <CustomStackFullWidth>
              {currentModuleType === "pharmacy" && (
                <div
                  style={{
                    marginBottom: "16px",
                  }}
                >
                  <MultiPrescriptionRoot
                    prescriptionImages={prescriptionImages}
                    setPrescriptionImages={setPrescriptionImages}
                  />
                </div>
              )}
              <CustomPaperBigCard
                height="auto"
                padding={isSmall ? "1rem" : "1.25rem"}
              >
                <Stack justifyContent="space-between">
                  <CouponTitle textAlign="left">{t("Billing")}</CouponTitle>
                  {zoneData && handleBadWeatherUi(zoneData?.zone_data)}
                  <SimpleBar
                    style={{
                      maxHeight: "180px",
                      width: "100%",
                    }}
                  >
                    <OrderSummaryDetails
                      page={page}
                      configData={configData}
                      cartList={cartList}
                      t={t}
                      campaignItemList={campaignItemList}
                      isSmall={isSmall}
                    />
                  </SimpleBar>

                  <OrderCalculation
                    usePartialPayment={usePartialPayment}
                    cartList={page === "campaign" ? campaignItemList : cartList}
                    storeData={storeData}
                    couponDiscount={couponDiscount}
                    taxAmount={data}
                    distanceData={distanceData}
                    total_order_amount={total_order_amount}
                    configData={configData}
                    couponInfo={couponInfo}
                    orderType={orderType}
                    deliveryTip={deliveryTip}
                    origin={{
                      latitude: storeData?.latitude,
                      longitude: storeData?.longitude,
                    }}
                    destination={address}
                    zoneData={zoneData}
                    extraCharge={extraCharge && extraCharge}
                    setDeliveryFee={setDeliveryFee}
                    setDeliveryFeeBeforeProDiscount={
                      setDeliveryFeeBeforeProDiscount
                    }
                    setMinDeliveryCharge={setMinDeliveryCharge}
                    extraChargeLoading={extraChargeLoading}
                    walletBalance={customerData?.data?.wallet_balance}
                    setPayableAmount={setPayableAmount}
                    additionalCharge={
                      configData?.additional_charge_status === 1 &&
                      configData?.additional_charge
                    }
                    payableAmount={payableAmount}
                    cashbackAmount={cashbackAmount}
                    handleExtraPackaging={handleExtraPackaging}
                    isPackaging={isPackaging}
                    packagingCharge={packagingCharge}
                    customerData={customerData}
                    initVauleEx={storeData?.extra_packaging_amount}
                    isLoading={isLoading}
                    selectedDeliveryOption={selectedDeliveryOption}
                    areaZipParams={areaZip.summaryParams}
                    setQuoteUnavailable={setQuoteUnavailable}
                    setSummaryLoading={setSummaryLoading}
                    setDeliveryOptions={setDeliveryOptions}
                    scheduleAt={scheduleAt}
                    currentZoneInfo={currentZoneInfo}
                  />

                  <PlaceOrder
                    placeOrder={placeOrder}
                    orderLoading={orderLoading}
                    zoneData={zoneData}
                    storeData={storeData}
                    isSchedules={isSchedules}
                    storeCloseToast={storeCloseToast}
                    page={page}
                    isLoading={isLoading}
                    totalAmount={totalAmount}
                    pricingLoading={storeDetailsFetching || summaryLoading}
                  />
                </Stack>
              </CustomPaperBigCard>
            </CustomStackFullWidth>
          </Grid>
          {openModal && (
            <CustomModal
              openModal={openModal}
              //handleClose={() => setOpenModal(false)}
            >
              <PartialPaymentModal
                payableAmount={payableAmount}
                agree={agreeToWallet}
                reject={notAgreeToWallet}
                colorTitle={t("Want to pay via your wallet?")}
                title={t("You can pay the full amount with your wallet.")}
                remainingBalance={
                  customerData?.data?.wallet_balance - payableAmount
                }
              />
            </CustomModal>
          )}
          {openPartialModel && (
            <CustomModal
              openModal={openPartialModel}
              //handleClose={() => setOpenPartialModel(false)}
            >
              <PartialPaymentModal
                payableAmount={payableAmount}
                agree={agreeToPartial}
                reject={notAgreeToPartial}
                colorTitle={t("Want to pay partially with wallet?")}
                title={t(
                  "You do not have sufficient balance to pay full amount via wallet.",
                )}
              />
            </CustomModal>
          )}
        </Grid>
      )}
    </Box>
  );
};

ItemCheckout.propTypes = {};

export default ItemCheckout;
