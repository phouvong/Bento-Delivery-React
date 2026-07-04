import { Grid, Card, IconButton, Box } from "@mui/material";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import { Stack } from "@mui/system";
import { useFormik } from "formik";
import { getToken } from "helper-functions/getToken";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { t } from "i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setParcelData } from "redux/slices/parcelDeliveryInfo";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import GuestCheckoutModal from "../../cards/GuestCheckoutModal";
import H1 from "../../typographies/H1";
import ParcelInfo from "./ParcelInfo";
import ReceiverInfoFrom from "./ReceiverInfoFrom";
import SenderInfoForm from "./SenderInfoForm";
import ValidationSchema from "./ValidationSchema";
import dynamic from "next/dynamic";
import { formatPhoneNumber } from "utils/CustomFunctions";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import SaveAddress from "../../SaveAddress";
import CustomModal from "components/modal";
import CloseIcon from "@mui/icons-material/Close";
import MapModal from "components/Map/MapModal";
import ProPlanBanner from "components/pro-plan/ProPlanBanner";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";

const AuthModal = dynamic(() => import("components/auth/AuthModal"));
const ProPlanSubscriptionModal = dynamic(() =>
  import("components/pro-plan/ProPlanSubscriptionModal")
);
const ProPlanPaymentModal = dynamic(() =>
  import("components/pro-plan/ProPlanPaymentModal")
);
const PercelDelivery = ({ configData }) => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { parcelInfo } = useSelector((state) => state.parcelInfoData);
  const { parcelCategories } = useSelector((state) => state.parcelCategories);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [openMapModal, setOpenMapModal] = useState(false);
  const [senderLocation, setSenderLocation] = useState(
    parcelInfo ? parcelInfo?.senderLocations : {}
  );
  const [senderFormattedAddress, setSenderFormattedAddress] = useState("");
  const [receiverLocation, setReceiverLocation] = useState(
    parcelInfo ? parcelInfo?.receiverLocations : {}
  );
  const [receiverFormattedAddress, setReceiverFormattedAddress] = useState(
    parcelInfo ? parcelInfo?.receiverAddress : ""
  );
  const [receiverZoneId, setReceiverZoneId] = useState(
    parcelInfo?.receiverZoneId ?? null
  );

  // Resolve the zone id for the receiver's coordinates so the parcel
  // order payload can include it (delivery-side dispatching needs the
  // receiver's zone, not just the sender's).
  const receiverHasLatLng = !!receiverLocation?.lat && !!receiverLocation?.lng;
  const { data: receiverZoneData } = useGetZoneId(
    receiverLocation,
    receiverHasLatLng
  );
  useEffect(() => {
    if (receiverZoneData?.zone_id == null) return;
    // The zone-id API returns `zone_id` as an array (e.g. [6]). Reduce it
    // to a single scalar so downstream order payloads send `zone_id: 6`
    // instead of the JSON-stringified array `"[6]"`.
    const raw = receiverZoneData.zone_id;
    const scalar = Array.isArray(raw) ? raw[0] : raw;
    setReceiverZoneId(scalar != null ? scalar : null);
  }, [receiverZoneData?.zone_id]);
  const [open, setOpen] = useState(false);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  let token = getToken();
  const [openAuth, setOpenAuth] = useState(false);
  const [modalFor, setModalFor] = useState("sign-in");
  const [senderOptionalAddress, setSenderOptionalAddress] = useState({});
  const [receiverOptionalAddress, setReceiverOptionalAddress] = useState({});
  const [openSave, setOpenSave] = useState(false);
  const [saveFrom, setSaveFrom] = useState("");

  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!token;
  const { data: activeOfferRaw, isLoading: activeOfferLoading } =
    useGetProActiveOffer({
      enabled: proFeatureEnabled && hasToken,
    });

  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  // `status` reflects whether a benefit applies on THIS module, not whether
  // the user is a Pro member. plan_details is present whenever they have
  // an active subscription, regardless of module-level eligibility.
  const isProMember =
    Number(activeOffer?.plan_details?.days_remaining) > 0 ||
    Boolean(activeOffer?.plan_details?.plan_name);
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proOfferResolved =
    !(proFeatureEnabled && hasToken) || !activeOfferLoading;
  const proSavingsMessage = (() => {
    // Parcel only ships things — never say "order" anywhere in the copy.
    const minOrderAmount = Number(proBenefit?.min_order_amount);
    const hasMin =
      proBenefit?.min_order_status === 1 &&
      Number.isFinite(minOrderAmount) &&
      minOrderAmount > 0;
    const minAmount = hasMin ? getAmountWithSign(minOrderAmount) : "";

    const fallback = hasMin
      ? t(
          "Save on delivery fees as a Pro member on deliveries above {{amount}}",
          {
            amount: minAmount,
          }
        )
      : t("Save on delivery fees as a Pro member");
    if (!proBenefit) return fallback;
    if (proBenefit?.type !== "delivery_fee") return fallback;

    const pct = Number(proBenefit?.charge_discount_percentage);
    const isFree =
      proBenefit?.offer_type === "free" ||
      proBenefit?.offer_type === "full_free";
    if (isFree) {
      return hasMin
        ? t("Free delivery as a Pro member on deliveries above {{amount}}", {
            amount: minAmount,
          })
        : t("Free delivery as a Pro member");
    }
    if (Number.isFinite(pct) && pct > 0) {
      return hasMin
        ? t(
            "{{percent}}% off on delivery fee as a Pro member on deliveries above {{amount}}",
            { percent: pct, amount: minAmount }
          )
        : t("{{percent}}% off on delivery fee as a Pro member", {
            percent: pct,
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
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proPaymentOpen, setProPaymentOpen] = useState(false);
  const [proSelectedPlan, setProSelectedPlan] = useState(null);
  const subscribeProMutation = useSubscribeProPlan();
  const handleProSubscribe = (plan) => {
    if (!plan) return;
    if (plan.price === 0) {
      subscribeProMutation.mutate(
        {
          plan_id: plan.id,
          payment_type: "free_trial",
          payment_method: "free_trial",
          callback_url:
            typeof window !== "undefined" ? window.location.href : "",
        },
        {
          onSuccess: (res) => {
            const redirect = res?.redirect_link ?? res?.data?.redirect_link;
            if (redirect && typeof window !== "undefined") {
              window.location.href = redirect;
              return;
            }
            toast.success(t("Subscribed successfully"));
            setProModalOpen(false);
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message || t("Subscription failed")
            );
          },
        }
      );
      return;
    }
    setProSelectedPlan(plan);
    setProModalOpen(false);
    setProPaymentOpen(true);
  };
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });
  console.log("proOfferResolved", proOfferResolved);
  const addAddressFormik = useFormik({
    initialValues: {
      senderName: token
        ? profileInfo?.f_name
          ? profileInfo?.f_name
          : ""
        : parcelInfo?.senderName
        ? parcelInfo?.senderName
        : "",
      senderPhone: token
        ? profileInfo?.phone
          ? formatPhoneNumber(profileInfo?.phone)
          : null
        : parcelInfo?.senderPhone
        ? formatPhoneNumber(parcelInfo?.senderPhone)
        : null,
      senderEmail: profileInfo
        ? profileInfo?.email
        : parcelInfo?.senderEmail
        ? parcelInfo?.senderEmail
        : "",
      receiverName: parcelInfo?.receiverName ? parcelInfo?.receiverName : "",
      receiverPhone: parcelInfo?.receiverPhone
        ? formatPhoneNumber(parcelInfo?.receiverPhone)
        : "",
      receiverEmail: parcelInfo?.receiverEmail ? parcelInfo?.receiverEmail : "",
      senderRoad: parcelInfo?.senderRoad ? parcelInfo?.senderRoad : "",
      senderHouse: parcelInfo?.senderHouse ? parcelInfo?.senderHouse : "",
      senderFloor: parcelInfo?.senderFloor ? parcelInfo?.senderFloor : "",
      road: parcelInfo?.road ? parcelInfo?.road : "",
      house: parcelInfo?.house ? parcelInfo?.house : "",
      floor: parcelInfo?.floor ? parcelInfo?.floor : "",
    },
    validationSchema: ValidationSchema(),
    onSubmit: async (values, helpers) => {
      await formSubmitHandler(values);
    },
  });
  console.log({ parcelInfo });
  useEffect(() => {
    const currentLocationLatLng = JSON.parse(
      localStorage.getItem("currentLatLng")
    );
    const currentLocation = localStorage.getItem("location");
    setSenderLocation(currentLocationLatLng);
    setSenderFormattedAddress(currentLocation);
  }, []);

  // Seed receiver location from query params passed by ParcelSearchPanel
  // (?lat=&lng=&location=). Only applied when parcelInfo has no prior receiver.
  useEffect(() => {
    const { lat, lng, location } = router.query;
    if (lat && lng && location && !parcelInfo?.receiverAddress) {
      setReceiverLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setReceiverFormattedAddress(decodeURIComponent(location));
    }
  }, [router.query]);
  useEffect(() => {
    addAddressFormik.setFieldValue(
      "senderPhone",
      profileInfo?.phone
        ? formatPhoneNumber(profileInfo?.phone)
        : formatPhoneNumber(parcelInfo?.senderPhone)
    );
  }, [profileInfo?.phone]);

  const handleOpenSave = (type) => {
    setSaveFrom(type);
    setOpenSave(true);
  };

  useEffect(() => {
    senderRoadHandler(
      senderOptionalAddress?.road
        ? senderOptionalAddress?.road
        : addAddressFormik.values.senderRoad
    );
    senderFloorHandler(
      senderOptionalAddress?.floor
        ? senderOptionalAddress?.floor
        : addAddressFormik.values.senderFloor
    );
    senderHouseHandler(
      senderOptionalAddress?.house
        ? senderOptionalAddress?.house
        : addAddressFormik.values.senderHouse
    );
  }, [senderOptionalAddress]);

  useEffect(() => {
    roadHandler(
      receiverOptionalAddress?.road
        ? receiverOptionalAddress?.road
        : addAddressFormik.values.road
    );
    floorHandler(
      receiverOptionalAddress?.floor
        ? receiverOptionalAddress?.floor
        : addAddressFormik.values.floor
    );
    houseHandler(
      receiverOptionalAddress?.house
        ? receiverOptionalAddress?.house
        : addAddressFormik.values.house
    );
  }, [receiverOptionalAddress]);

  const senderNameHandler = (value) => {
    addAddressFormik.setFieldValue("senderName", value);
  };
  const senderPhoneHandler = (value) => {
    addAddressFormik.setFieldValue("senderPhone", value);
  };
  const receiverNameHandler = (value) => {
    addAddressFormik.setFieldValue("receiverName", value);
  };
  const receiverPhoneHandler = (value) => {
    addAddressFormik.setFieldValue("receiverPhone", value);
  };
  const roadHandler = (value) => {
    addAddressFormik.setFieldValue("road", value);
  };
  const houseHandler = (value) => {
    addAddressFormik.setFieldValue("house", value);
  };
  const floorHandler = (value) => {
    addAddressFormik.setFieldValue("floor", value);
  };
  const senderRoadHandler = (value) => {
    addAddressFormik.setFieldValue("senderRoad", value);
  };
  const senderHouseHandler = (value) => {
    addAddressFormik.setFieldValue("senderHouse", value);
  };
  const senderFloorHandler = (value) => {
    addAddressFormik.setFieldValue("senderFloor", value);
  };

  const senderEmailHandler = (value) => {
    addAddressFormik?.setFieldValue("senderEmail", value);
  };
  const handleSenderLocation = (location, currentLocation) => {
    setSenderLocation(location);
    setSenderFormattedAddress(currentLocation);
  };
  const handleReceiverLocation = (location, currentLocation) => {
    console.log({ location, currentLocation });

    setReceiverLocation(location);
    setReceiverFormattedAddress(currentLocation);
  };
  const receiverEmailHandler = (value) => {
    addAddressFormik?.setFieldValue("receiverEmail", value);
  };

  const handleRoute = () => {
    router.push("/checkout?page=parcel", undefined, { shallow: true });
  };
  let currentLocation = {};

  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
    currentLocation = JSON.parse(localStorage.getItem("currentLatLng"));
  }
  console.log({ parcelCategories });
  console.log({ receiverLocation });

  const formSubmitHandler = (values) => {
    if (!parcelCategories?.id) {
      toast.error(t("Please select parcel category to proceed"));
      return;
    }
    if (!currentLocation?.lat || !currentLocation?.lng) {
      setOpenMapModal(true);
      toast.error(t("Please select your location to proceed"));
      return;
    }

    const effectiveSenderLocation =
      senderLocation && senderLocation.lat && senderLocation.lng
        ? senderLocation
        : parcelInfo?.senderLocations;
    const effectiveReceiverLocation =
      receiverLocation && receiverLocation.lat && receiverLocation.lng
        ? receiverLocation
        : parcelInfo?.receiverLocations;

    const hasSenderLatLng =
      !!effectiveSenderLocation?.lat && !!effectiveSenderLocation?.lng;
    const hasReceiverLatLng =
      !!effectiveReceiverLocation?.lat && !!effectiveReceiverLocation?.lng;

    if (!hasSenderLatLng && !hasReceiverLatLng) {
      toast.error(t("Please pick sender and receiver location on the map"));
      return;
    }
    if (!hasSenderLatLng) {
      toast.error(t("Please pick the sender location on the map"));
      return;
    }
    if (!hasReceiverLatLng) {
      toast.error(t("Please pick the receiver location on the map"));
      return;
    }

    const tempValue = {
      ...values,
      senderLocations: effectiveSenderLocation,
      senderAddress: senderFormattedAddress,
      receiverLocations: effectiveReceiverLocation,
      receiverAddress: receiverFormattedAddress,
      receiverZoneId,
      name: parcelCategories?.name,
      image: parcelCategories?.image_full_url,
      description: parcelCategories?.description,
    };

    dispatch(setParcelData(tempValue));
    if (!token && configData?.guest_checkout_status === 1) {
      setOpen(true);
    } else if (token) {
      router.push(
        {
          pathname: "/checkout",
          query: { page: "parcel" },
        },
        undefined,
        { shallow: true }
      );
    } else {
      setOpenAuth(true);
    }
  };

  return (
    <CustomStackFullWidth
      paddingBottom={{ xs: "20px", sm: "20px", md: "80px" }}
      pt="2.5rem"
    >
      <Stack paddingBottom="30px">
        <H1
          text="Parcel Delivery Information"
          textAlign="left"
          fontWeight="600"
          component="h1"
        />
      </Stack>
      <form noValidate onSubmit={addAddressFormik.handleSubmit}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12}>
            <ParcelInfo parcelCategories={parcelCategories} />
          </Grid>
          {proFeatureEnabled &&
            proOfferResolved &&
            !isProActive &&
            !isProMember &&
            activeOffer?.message !== "no_benefit_for_module" && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    padding: { xs: "12px", md: "20px" },
                    backgroundColor: (theme) => theme.palette.background.paper,
                    border: (theme) =>
                      `1px solid ${
                        theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)"
                      }`,
                    borderRadius: "16px",
                    boxShadow: "none",
                  }}
                >
                  <ProPlanBanner
                    onSubscribe={() => {
                      if (!hasToken) {
                        toast.error(t("Please login to use this feature"));
                        return;
                      }
                      setProModalOpen(true);
                    }}
                  />
                </Card>
              </Grid>
            )}
          {proFeatureEnabled &&
            hasToken &&
            proOfferResolved &&
            isProActive &&
            proBenefit?.type === "delivery_fee" && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    padding: { xs: "12px", md: "20px" },
                    backgroundColor: (theme) => theme.palette.background.paper,
                    border: (theme) =>
                      `1px solid ${
                        theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)"
                      }`,
                    borderRadius: "16px",
                    boxShadow: "none",
                  }}
                >
                  <ProSavingsBanner
                    amount={
                      activeOffer?.total_saved ??
                      activeOffer?.plan_details?.total_saved
                    }
                    message={proSavingsMessage}
                  />
                </Card>
              </Grid>
            )}
          <Grid item xs={12}>
            <Card
              sx={{
                padding: { xs: "12px", md: "20px" },
                backgroundColor: (theme) => theme.palette.background.paper,
                border: (theme) =>
                  `1px solid ${
                    theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)"
                  }`,
                borderRadius: "16px",
                boxShadow: "none",
              }}
            >
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <SenderInfoForm
                    addAddressFormik={addAddressFormik}
                    senderNameHandler={senderNameHandler}
                    senderPhoneHandler={senderPhoneHandler}
                    coords={coords}
                    configData={configData}
                    senderFormattedAddress={senderFormattedAddress}
                    handleLocation={handleSenderLocation}
                    setSenderFormattedAddress={setSenderFormattedAddress}
                    setSenderLocation={setSenderLocation}
                    senderRoadHandler={senderRoadHandler}
                    senderHouseHandler={senderHouseHandler}
                    senderFloorHandler={senderFloorHandler}
                    senderEmailHandler={senderEmailHandler}
                    handleOpenSave={handleOpenSave}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ReceiverInfoFrom
                    handleOpenSave={handleOpenSave}
                    addAddressFormik={addAddressFormik}
                    receiverNameHandler={receiverNameHandler}
                    receiverPhoneHandler={receiverPhoneHandler}
                    roadHandler={roadHandler}
                    houseHandler={houseHandler}
                    floorHandler={floorHandler}
                    coords={coords}
                    handleLocation={handleReceiverLocation}
                    receiverFormattedAddress={receiverFormattedAddress}
                    setReceiverLocation={setReceiverLocation}
                    setReceiverFormattedAddress={setReceiverFormattedAddress}
                    configData={configData}
                    receiverEmailHandler={receiverEmailHandler}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "stretch", md: "flex-end" },
            mt: { xs: 2, md: 3 },
          }}
        >
          <CustomButtonPrimary
            type="submit"
            sx={{
              width: { xs: "100%", md: "auto" },
              maxWidth: { xs: "100%", md: "none" },
              minWidth: { md: "220px" },
              px: { md: 4 },
              height: "48px",
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            {t("Proceed To Checkout")}
          </CustomButtonPrimary>
        </Box>
      </form>
      {open && (
        <GuestCheckoutModal
          open={open}
          setOpen={setOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          handleRoute={handleRoute}
          setModalFor={setModalFor}
          setOpenAuth={setOpenAuth}
        />
      )}
      <AuthModal
        modalFor={modalFor}
        setModalFor={setModalFor}
        open={openAuth}
        handleClose={() => setOpenAuth(false)}
      />
      {openSave && (
        <CustomModal
          openModal={openSave}
          handleClose={() => setOpenSave(false)}
        >
          <CustomStackFullWidth
            sx={{
              minWidth: "350px",
              position: "relative",
              padding: "1rem 1rem",
            }}
          >
            <IconButton
              onClick={() => setOpenSave(false)}
              sx={{
                position: "absolute",
                top: -2,
                right: 0,
                zIndex: 2,
                backgroundColor: (theme) => theme.palette.background.paper,
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "1rem" }} />
            </IconButton>

            <SaveAddress
              configData={configData}
              setSenderFormattedAddress={setSenderFormattedAddress}
              setSenderLocation={setSenderLocation}
              setSenderOptionalAddress={setSenderOptionalAddress}
              setReceiverFormattedAddress={setReceiverFormattedAddress}
              setReceiverLocation={setReceiverLocation}
              setReceiverOptionalAddress={setReceiverOptionalAddress}
              sender={saveFrom === "sender" ? "true" : undefined}
              setOpenSave={setOpenSave}
              parcel
            />
          </CustomStackFullWidth>
        </CustomModal>
      )}
      {openMapModal && (
        <MapModal
          open={openMapModal}
          handleClose={() => setOpenMapModal(false)}
          disableAutoFocus
          fromStore
          fromparcel
        />
      )}
      {proFeatureEnabled && proModalOpen && (
        <ProPlanSubscriptionModal
          open={proModalOpen}
          onClose={() => setProModalOpen(false)}
          onSubscribe={handleProSubscribe}
          isSubmitting={subscribeProMutation.isLoading}
        />
      )}
      {proFeatureEnabled && proPaymentOpen && (
        <ProPlanPaymentModal
          open={proPaymentOpen}
          onClose={() => setProPaymentOpen(false)}
          plan={proSelectedPlan}
        />
      )}
    </CustomStackFullWidth>
  );
};

export default PercelDelivery;
